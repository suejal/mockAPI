# mockAPI 🚀
Try it out - https://mockapisujal.netlify.app/

**mockAPI** is aMock API generator designed to generate a REST API with fake data just by describing what you need in plain English! It uses **Groq** under the hood to intelligently generate schemas based on your prompt, and relies on **Faker.js** to populate endpoints with realistic mock data. 

## ✨ Features  
- **Natural Language Parsing**: Just type what you want (e.g., `"users with name, email, age"`).  
- **Instant REST Endpoints**: Automatically spins up `GET` endpoints for your requested resources.  
- **Realistic Mock Data**: Populated using `Faker.js` so your data looks like the real deal.  
- **Ready-to-Use Code Snippets**: Provides copy-pasteable `fetch` snippets so you can integrate right away.  
- **Sleek UI**: Built with Next.js and Tailwind CSS for a seamless, blazing-fast experience. 

## 🛠️ Tech Stack  
- **Framework**: Next.js (App Router)  
- **Styling**: Tailwind CSS  
- **LLM/AI Integration**: Groq SDK (for natural language-to-schema extraction)  
- **Data Generation**: Faker.js  

## 🚀 Getting Started  

### Prerequisites  
Make sure you have Node.js installed. You'll also need a **Groq API Key** to enable the AI schema generation.  

## 💡 How It Works  
1. Enter a prompt like `"list of 5 ecommerce products with price and description"`.  
2. mockAPI securely calls Groq to parse the structure and returns a JSON schema.  
3. Using Faker.js, the backend dynamically creates the endpoints and feeds them with random data matching your schema.  
4. Copy the API URL and drop it into your app!  

## 🤝 Contributing  
Contributions, issues, and feature requests are welcome! Feel free to check the issues page if you want to contribute.  
