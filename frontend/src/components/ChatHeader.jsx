import { HiOutlineDotsVertical } from "react-icons/hi";
import { RiArrowDropLeftLine } from "react-icons/ri";

const Header = () => {
    return(
        <>
        {/* Información de contacto */}
        <div className="bg-[#11181d] h-[8%] flex items-center text-white p-4 justify-between">
                <div className="flex gap-4 items-center">
                    {/* Flecha atrás */}
                    <RiArrowDropLeftLine className="text-2xl" />

                    {/* Imagen y nombre */}
                    <img
                        src="https://img.freepik.com/foto-gratis/retrato-hermoso-mujer-joven-posicion-pared-gris_231208-10760.jpg?w=900&t=st=1702135651~exp=1702136251~hmac=3a04dc5adc820c515c160625c5a54080dc16ef096bdb39a8628a978903b875bb"
                        className="h-10 w-10 object-cover rounded-full"
                    />
                    <h2 className="text-xl">Jane Doe</h2>
                </div>

                {/* Botón de opciones */}
                <a href="#" className="text-xl rounded-full">
                    <HiOutlineDotsVertical />
                </a>
            </div>
        </>
    )
}

export default Header;