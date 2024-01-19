const AsstConfig = () => {
    return (
        // contenedor padre
        <div className="h-screen flex flex-col items-center">

            {/* Contenedor de configuraciones */}
            <div className="h-full w-full">
                <form action="submit" className="h-full w-full">
                    <div className="h-full w-full flex flex-col p-4">
                        {/* Nombre del asistente  */}
                        <div className="w-full flex flex-col h-26">
                            <label
                                htmlFor="name"
                                className="text-md font-semibold p-2"
                            >
                                Nombre
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                maxLength="50"
                                placeholder="Ingresa un nombre para tu asistente"
                                className="border border-[#11181d] rounded p-2 outline-none"
                            />
                        </div>

                        {/* Intrucciones */}
                        <div className="w-full flex flex-col pt-2">
                            <label
                                htmlFor="textarea"
                                className="text-md font-semibold p-2"
                            >
                                Intrucciones
                            </label>
                            <textarea
                                name="textarea"
                                rows={3}
                                placeholder="Introduce las instrucciones"
                                className="border border-[#11181d] rounded p-2 outline-none"
                            ></textarea>
                        </div>

                        {/* Modelo */}
                        <div className="w-full flex flex-col pt-2">
                            <label
                                htmlFor="setlect"
                                className="text-md font-semibold p-2"
                            >
                                Modelo
                            </label>

                            <select
                                name="select"
                                id="select"
                                className="border border-[#11181d] rounded p-2 bg-white outline-none"
                            >
                                <option value="gpt-3.5-turbo-1106">
                                    gpt-3.5-turbo-1106
                                </option>
                                <option value="gpt-4-turbo-preview">
                                    gpt-4-turbo-preview
                                </option>
                                <option value="gpt-3.5-turbo">
                                    gpt-3.5-turbo
                                </option>
                            </select>
                        </div>

                        {/* Herramientas */}
                        <div className="w-full flex-column pt-2">
                            <h1 className="text-md font-semibold p-2 border-b">
                                Herramientas
                            </h1>

                            <div className="flex flex-col p-2">
                                {/* Funciones */}
                                <div className="flex justify-between border-b py-2 text-md text-neutral-500 font-bold">
                                    <h2>Funciones</h2>
                                    <a 
                                    className="text-[#11181d]">
                                        Agregar
                                    </a>
                                </div>

                                {/* Code interpreter */}
                                <div className="flex justify-between border-b py-2 text-md text-neutral-500 font-bold">
                                    <h2>Intérprete de código</h2>
                                    <input type="checkbox" />
                                </div>

                                {/* Retrieval */}
                                <div className="flex justify-between border-b py-2 text-md text-neutral-500 font-bold">
                                    <h2>Leer desde archivo</h2>
                                    <input type="checkbox" />
                                </div>

                                {/* Conectar con WhatsApp */}
                                <div className="flex justify-between border-b py-2 text-md text-neutral-500 font-bold">
                                    <h2>WhatsApp</h2>
                                    <a
                                    href="#"  
                                    className="text-[#11181d]">
                                    Conectar
                                    </a>
                                </div>
                                {/* Añadi archivos */}
                                <div className="flex justify-between border-b py-2 text-md text-neutral-500 font-bold">
                                    <h2>Archivo</h2>
                                    <a
                                    href="#" 
                                    className="text-[#11181d]">
                                    Agregar
                                    </a>
                                </div>
                            </div>

                            {/* Archivos agregados */}
                            {/* <div className="flex flex-col justify-between p-2">
                                <h2 className="text-md font-semibold border-b py-2">
                                    Archivos
                                </h2>

        
                                <div className="flex flex-col h-52 items-start mt-4 text-neutral-500 overflow-auto gap-2">
                                    <div className="bg-gray-100 border border-green-400 rounded-full h-8 flex items-center px-4">
                                        <h3>Somefile.pdf</h3>
                                    </div>
                                    <div className="bg-gray-100 border border-green-400 rounded-full h-8 flex items-center px-4">
                                        <h3>title-for-a-book-wi-info.pdf</h3>
                                    </div>
                                    <div className="bg-gray-100 border border-green-400 rounded-full h-8 flex items-center px-4">
                                        <h3>Somefile.pdf</h3>
                                    </div>
                                    <div className="bg-gray-100 border border-green-400 rounded-full h-8 flex items-center px-4">
                                        <h3>Somefile.pdf</h3>
                                    </div>
                                </div>
                            </div> */}
                            
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AsstConfig;