import OpenAI from "openai";
const client = new OpenAI();

const response = await client.responses.create({
    model: "gpt-5",
    input: "日本語でセクシーに挨拶して。"
});

console.log(response.output_text);