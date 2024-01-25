import { useState } from "react";
import axios from "axios";
import { marked } from "marked";

function PDFSummariser() {
    // const [inputValue, setInputValue] = useState('');
    const [result, setResult] = useState("");
    const [jresult, setJresult] = useState("");
    const [error, setError] = useState("");
    const [maxWords, setMaxWords] = useState(500);
    const [model, setModel] = useState("gemini-pro");
    const [selectedFile, setSelectedFile] = useState(false);
    const [loading, setLoading] = useState(false);

    const models = ["gemini-pro", "gpt-3.5-turbo-1106"];

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
        setResult("");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError("");
        setResult("");

        if (!maxWords) {
            setError("Please enter a number of words for the summary.");
            setResult("");
            setJresult("");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("pdf", selectedFile);
            formData.append("maxWords", maxWords);
            formData.append("model", model);

            console.log(formData);

            const response = await axios.post(
                "http://192.168.1.70:3001/api/v1/pdfsummary",
                formData,
                {
                    // const response = await axios.post('/api/pdfsummary', formData, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
            );
            console.log(response.data);

            if (response.data.error) {
                setError(response.data.error);
                return;
            }

            setError("");
            setResult(marked.parse(response.data.summarisedText));

            // setJresult(JSON.stringify(response.data, null, 2));
        } catch (error) {
            console.log(error);
            setResult("");
            setError("An error occurred while submitting the form.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen w-full flex flex-col items-center ">
            <div className="border bg-zinc-100 w-[90%] h-[450px] flex flex-col items-center mt-10 rounded-lg">
                <h1 className="text-6xl text-center mt-10">
                    PDF Smart summary.
                </h1>
                <p className="text-4xl text-center m-4">
                    ¡Aprende más rápido leyendo sólo lo que importa!
                </p>
                <form
                    className="w-[50%] flex flex-col justify-center items-center"
                    onSubmit={handleSubmit}
                >
                    <input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileChange}
                        className=""
                    ></input>
                    <div className="">
                        <div className="flex justify-center mt-6">
                            <label htmlFor="max words" className="mr-2">
                                Palabras
                            </label>
                            <input
                                id="max words"
                                type="number"
                                min="200"
                                value={maxWords}
                                onChange={(e) => {
                                    setMaxWords(e.target.value);
                                    setResult("");
                                }}
                                className="border border-slate-300 rounded-sm"
                            ></input>
                        </div>
                        <div className="flex justify-center mt-6">
                            <label htmlFor="model" className="mr-2">
                                Modelo
                            </label>
                            <select
                                id="model"
                                value={model}
                                onChange={(e) => {
                                    setModel(e.target.value);
                                    setResult("");
                                }}
                                className="border border-slate-300 rounded-sm"
                            >
                                {models.map((model, index) => (
                                    <option key={index} value={model}>
                                        {model}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button
                            type="submit"
                            disabled={!selectedFile || loading}
                            className="border p-4 px-20 bg-blue-500 rounded-md mt-6 text-lg text-white font-bold capitalize"
                        >
                            {loading
                                ? "Resumiendo PDF..."
                                : `Resumir PDF en alrededor de ${maxWords} palabras`}
                        </button>
                    </div>
                </form>
            </div>
            <div className="w-[800px] flex flex-col justify-center items-center p-8">
                <div className="w-auto">
                    {error && <div className="">{error}</div>}
                    {result && (
                        <div
                            className="font-sans prose prose-xl"
                            dangerouslySetInnerHTML={{ __html: result }}
                        ></div>
                    )}
                    {jresult && (
                        <pre className="">
                            <code>{jresult}</code>
                        </pre>
                    )}
                </div>
            </div>
        </div>
    );
}

export default PDFSummariser;
