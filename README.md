# Career Guidance Chatbot

An AI-powered chatbot that helps students make informed decisions about their college branches and career paths. The chatbot provides detailed information about different branches in Indian colleges, including risks, advantages, and career prospects.

## Features

- Interactive chat interface
- Information about various Indian colleges
- Detailed insights about different engineering branches
- Risk assessment for each branch
- Career prospects and salary information
- Chat history preservation

## Tech Stack

- **Frontend:**
  - React
  - Material-UI
  - Axios

- **Backend:**
  - NodeJS
  - MongoDB
  - Hugging Face Transformers

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Initialize the database:
   ```bash
   python -m flask --app app init-db
   ```


### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The application will be available at `http://localhost:3000`

## Usage

1. Open the application in your web browser
2. Type your questions about college branches or career paths
3. The chatbot will provide detailed responses including:
   - Branch information
   - Risks and advantages
   - Career prospects
   - Average salary expectations

## Sample Questions

- "What are the risks of choosing Computer Science at IIT Bombay?"
- "Tell me about the career prospects in Electrical Engineering"
- "What are the advantages of Chemical Engineering at BITS Pilani?"
- "Compare Mechanical Engineering and Electrical Engineering"

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
