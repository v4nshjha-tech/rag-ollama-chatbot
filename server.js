const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { PDFParse } = require("pdf-parse");

const app = express();

const PORT = 3000;
const OLLAMA_URL = "http://127.0.0.1:11434";

const CHAT_MODEL = "qwen2.5:1.5b";
const EMBEDDING_MODEL = "nomic-embed-text";

// Stores the currently uploaded PDF and its embeddings.
let currentDocument = null;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Upload directory
const uploadDir = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },

    filename: (req, file, cb) => {
        const uniqueName =
            Date.now() + "-" +
            file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");

        cb(null, uniqueName);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 20 * 1024 * 1024 },

    fileFilter: (req, file, cb) => {
        if (file.mimetype === "application/pdf") {
            cb(null, true);
        } else {
            cb(new Error("Only PDF files are allowed."));
        }
    }
});

// Split text into overlapping chunks
function splitTextIntoChunks(text, chunkSize = 900, overlap = 150) {
    const chunks = [];

    const cleanText = text.replace(/\s+/g, " ").trim();

    let start = 0;

    while (start < cleanText.length) {
        const end = Math.min(start + chunkSize, cleanText.length);

        const chunk = cleanText.slice(start, end).trim();

        if (chunk.length > 0) {
            chunks.push(chunk);
        }

        start += chunkSize - overlap;
    }

    return chunks;
}

// Generate embeddings in batches
async function generateEmbeddings(texts) {
    const allEmbeddings = [];
    const batchSize = 20;

    for (let i = 0; i < texts.length; i += batchSize) {
        const batch = texts.slice(i, i + batchSize);

        const response = await fetch(`${OLLAMA_URL}/api/embed`, {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                model: EMBEDDING_MODEL,
                input: batch
            })
        });

        if (!response.ok) {
            throw new Error(
                `Embedding API failed: ${response.status}`
            );
        }

        const data = await response.json();

        allEmbeddings.push(...data.embeddings);
    }

    return allEmbeddings;
}

// Calculate cosine similarity
function cosineSimilarity(a, b) {
    let dotProduct = 0;
    let magnitudeA = 0;
    let magnitudeB = 0;

    for (let i = 0; i < a.length; i++) {
        dotProduct += a[i] * b[i];

        magnitudeA += a[i] * a[i];
        magnitudeB += b[i] * b[i];
    }

    if (magnitudeA === 0 || magnitudeB === 0) {
        return 0;
    }

    return dotProduct /
        (Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB));
}

// Home route
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Test route
app.get("/test", (req, res) => {
    res.json({
        message: "Backend is working!"
    });
});

// PDF upload and processing
app.post("/upload", upload.single("pdf"), async (req, res) => {
    let parser;

    try {
        console.log("UPLOAD REQUEST RECEIVED");

        if (!req.file) {
            return res.status(400).json({
                error: "Please upload a PDF file."
            });
        }

        console.log("File received:", req.file.originalname);

        const dataBuffer = fs.readFileSync(req.file.path);

        parser = new PDFParse({
            data: dataBuffer
        });

        const result = await parser.getText();

        const extractedText = result.text;
        console.log("EXTRACTED TEXT LENGTH:", extractedText.length);
console.log("TEXT LENGTH:", extractedText.length);
console.log("PDF TEXT PREVIEW:", extractedText.substring(0, 2000));
        if (!extractedText || !extractedText.trim()) {
            return res.status(400).json({
                error: "No readable text found in this PDF."
            });
        }

        console.log("PDF READ SUCCESSFULLY");

        // Step 1: Split PDF text
        const chunks = splitTextIntoChunks(extractedText);

        console.log("Total chunks:", chunks.length);

        // Step 2: Generate embeddings
        const embeddings = await generateEmbeddings(chunks);

        if (embeddings.length !== chunks.length) {
            throw new Error("Embedding count does not match chunk count.");
        }

        // Step 3: Store document and embeddings
        currentDocument = {
            filename: req.file.originalname,

            chunks: chunks.map((text, index) => ({
                text,
                embedding: embeddings[index]
            }))
        };

        console.log("PDF EMBEDDINGS GENERATED SUCCESSFULLY");

        res.json({
            success: true,
            message: "PDF processed successfully!",
            filename: req.file.originalname,
            pages: result.total,
            totalChunks: chunks.length
        });

    } catch (error) {
        console.error("PDF ERROR:", error);

        res.status(500).json({
            error: error.message || "PDF processing failed."
        });

    } finally {
        if (parser) {
            await parser.destroy().catch(console.error);
        }

        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
    }
});

// RAG chat route
app.post("/chat", async (req, res) => {
    try {
        const { message } = req.body;

        if (!message || !message.trim()) {
            return res.status(400).json({
                error: "Message is required."
            });
        }

        if (!currentDocument) {
            return res.status(400).json({
                error: "Please upload a PDF before asking questions."
            });
        }

        console.log("USER QUESTION:", message);

        // Step 1: Generate question embedding
        const queryEmbeddings = await generateEmbeddings([message]);

        const queryEmbedding = queryEmbeddings[0];

        // Step 2: Find the most relevant chunks
        const relevantChunks = currentDocument.chunks
            .map(chunk => ({
                text: chunk.text,

                score: cosineSimilarity(
                    queryEmbedding,
                    chunk.embedding
                )
            }))
            .sort((a, b) => b.score - a.score)
            .slice(0, 4);

        // Step 3: Build PDF context
        const context = relevantChunks
            .map((chunk, index) =>
                `Context ${index + 1}:\n${chunk.text}`
            )
            .join("\n\n");

        // Step 4: Ask Qwen using retrieved PDF context
        const prompt = `
You are a helpful PDF assistant.

Answer the user's question using ONLY the information
provided in the PDF context below.

If the answer is not available in the context,
clearly say that the uploaded PDF does not contain
enough information to answer the question.

Do not invent facts.

PDF CONTEXT:
${context}

USER QUESTION:
${message}

ANSWER:
`;

        const response = await fetch(`${OLLAMA_URL}/api/generate`, {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

          body: JSON.stringify({
    model: CHAT_MODEL,
    prompt: prompt,
    stream: false,
    keep_alive: "10m",
    options: {
        num_predict: 200,
        num_ctx: 2048,
        temperature: 0.2
    }
})
        });

        if (!response.ok) {
            throw new Error(
                `Ollama API error: ${response.status}`
            );
        }

        const data = await response.json();

        console.log("RAG RESPONSE GENERATED");

        res.json({
            success: true,
            answer: data.response,
            source: currentDocument.filename
        });

    } catch (error) {
        console.error("CHAT ERROR:", error);

        res.status(500).json({
            error: "AI generation failed: " + error.message
        });
    }
});

// Error handler
app.use((err, req, res, next) => {
    console.error("SERVER ERROR:", err);

    res.status(err.status || 500).json({
        error: err.message || "Internal server error."
    });
});

// Start server
app.listen(PORT, () => {
    console.log("--------------------------------");
    console.log("RAG AI CHATBOT SERVER STARTED");
    console.log(`Server: http://localhost:${PORT}`);
    console.log(`Ollama: ${OLLAMA_URL}`);
    console.log(`Chat Model: ${CHAT_MODEL}`);
    console.log(`Embedding Model: ${EMBEDDING_MODEL}`);
    console.log("--------------------------------");
});