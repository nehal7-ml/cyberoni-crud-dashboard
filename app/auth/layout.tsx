import Image from "next/image";

function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (

        <div className="container mx-auto max-w-md h-screen">
            <div className="flex justify-center items-center h-full">
                <div className=" py-10 p-5 lg:p-10 bg-gray-50 text-gray-950 rounded-[30px] shadow-lg flex-col justify-center items-center">
                    <Image className="mx-auto" src={"/signin-1.png"} alt="signin" height={500} width={300} />
                    <div>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AuthLayout;