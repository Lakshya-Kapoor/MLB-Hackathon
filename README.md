# MLB Hackathon

## Getting started

### Prerequisites

1. Python 3.6 or higher
2. Pip (Python package manager)
3. Git

### Project setup

1. Clone the repo:

   ```bash
   git clone https://github.com/Lakshya-Kapoor/MLB-Hackathon.git
   ```

2. Enter the project directory:

   ```bash
   cd MLB-Hackathon/backend/
   ```

3. Create a virtual environment:

   ```bash
   python3 -m venv myenv

   # On Windows:
   myenv\Scripts\activate

   # On macOS and Linux:
   source myenv/bin/activate
   ```

4. Install the dependencies:

   ```bash
    pip install -r requirements.txt
   ```

5. Run the fast api server:

   ```bash
   uvicorn main:app --reload
   ```
