import { Dispatch, ReactNode, SetStateAction } from "react";

function Modal({ children, show, setShow }: { children: ReactNode, show: boolean, setShow: Dispatch<SetStateAction<boolean>> }) {

    return (
        <>

            {
                show ? <div className="fixed inset-0 z-50 flex items-center justify-center text-black backdrop-blur-md">

                    {children}

                </div> :
                    null

            }
        </>

    );
}

export default Modal;