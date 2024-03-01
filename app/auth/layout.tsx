import Image from "next/image";

function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container mx-auto h-screen max-w-md">
      <div className="flex h-full items-center justify-center">
        <div className=" flex-col items-center justify-center rounded-[30px] bg-gray-50 p-5 py-10 text-gray-950 shadow-lg lg:p-10">
          <Image
            className="mx-auto"
            src={"/signin-1.png"}
            alt="signin"
            height={500}
            width={300}
          />
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
