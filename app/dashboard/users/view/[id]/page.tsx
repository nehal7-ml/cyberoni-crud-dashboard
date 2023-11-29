
import { CreateUserDTO, read } from "@/crud/user";
import UserForm from "@/components/UserForm";
import { prisma } from "@/prisma/prismaClient";



const UpdateUserForm = async ({ params }: { params: { id: string } }) => {
    const user = await read(params.id, prisma) as CreateUserDTO;
    return (<UserForm method="PUT" initial={user} action={`/api/users/${params.id}`} />)

}

export default UpdateUserForm;
