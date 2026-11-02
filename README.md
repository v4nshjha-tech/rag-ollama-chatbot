# ✦ RAG AI – Intelligent PDF Assistant

An AI-powered PDF chatbot that allows users to upload PDF documents and ask questions in natural language. Built using **Retrieval-Augmented Generation (RAG)**, vector embeddings, and locally running AI models.

<p align="center">
  <b>Upload PDFs • Retrieve Context • Generate Intelligent Answers</b>
</p>

---

## 🚀 Overview

RAG AI is an intelligent document assistant designed to make information retrieval from PDF documents faster and easier.

Instead of manually searching through lengthy documents, users can upload a PDF and interact with its content through a conversational AI interface.

The application uses semantic search to retrieve relevant document passages and provides context-aware answers using a locally running language model.

## ✨ Features

* 📄 PDF document upload
* 📝 Automatic PDF text extraction
* ✂️ Intelligent text chunking with overlap
* 🧠 Vector embedding generation
* 🔍 Semantic similarity search
* 💬 AI-powered question answering
* ⚡ Context-aware responses using RAG
* 🎨 Modern dark-themed responsive interface
* 🔒 Local AI processing using Ollama

## 🛠️ Technology Stack

| Technology       | Purpose                  |
| ---------------- | ------------------------ |
| HTML5            | Frontend structure       |
| CSS3             | UI styling               |
| JavaScript       | Frontend functionality   |
| Node.js          | Backend runtime          |
| Express.js       | REST API                 |
| Multer           | PDF file uploads         |
| pdf-parse        | PDF text extraction      |
| Ollama           | Local AI model execution |
| Qwen 2.5         | Language model           |
| Nomic Embed Text | Text embeddings          |
| Git & GitHub     | Version control          |

## 🏗️ How It Works

The application follows a Retrieval-Augmented Generation architecture.

1. **PDF Upload:** Users upload a PDF document.
2. **Text Extraction:** The backend extracts readable text using pdf-parse.
3. **Text Chunking:** Extracted text is divided into smaller overlapping chunks.
4. **Embedding Generation:** Nomic Embed Text converts chunks into numerical vectors.
5. **Semantic Retrieval:** Cosine similarity identifies the most relevant document chunks.
6. **Answer Generation:** Qwen 2.5 generates an answer using the retrieved PDF context.

## 📂 Project Structure

```text
rag-ollama-chatbot/
│
├── public/
│   └── index.html
│
├── uploads/
│
├── server.js
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```

## ⚙️ Installation & Setup

### Prerequisites

* Node.js
* npm
* Ollama

### 1. Clone the Repository

```bash
git clone https://github.com/v4nshjha-tech/rag-ollama-chatbot.git
```

### 2. Navigate to the Project

```bash
cd rag-ollama-chatbot
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Install Ollama Models

```bash
ollama pull qwen2.5:1.5b
ollama pull nomic-embed-text
```

### 5. Start Ollama

```bash
ollama serve
```

If Ollama is already running in the background, you can skip this step.

### 6. Start the Backend

Open another terminal and run:

```bash
node server.js
```

### 7. Open the Application

Visit:

```text
http://localhost:3000
```

Your RAG AI PDF Assistant is ready!

## 🔮 Future Improvements

* Support for multiple PDF documents.
* Persistent vector database integration.
* OCR support for scanned PDFs.
* Streaming AI responses.
* User authentication and document management.
* Improved response speed and retrieval accuracy.
* Cloud deployment and public access.

## ⚠️ Current Limitations

* Currently processes one active PDF at a time.
* Document embeddings are stored in server memory.
* Restarting the backend clears the indexed document.
* Requires Ollama and the configured AI models to be running locally.
* Scanned PDFs without extractable text are not currently supported.

## 👨‍💻 Developer

**Vansh Jha**

Computer Science Student | Aspiring Software Developer

* GitHub: [@v4nshjha-tech](https://github.com/v4nshjha-tech)
* LinkedIn: [Vansh Jha](https://www.linkedin.com/in/vansh-jha-318a09338)

---


