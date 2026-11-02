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

### Prerequ
