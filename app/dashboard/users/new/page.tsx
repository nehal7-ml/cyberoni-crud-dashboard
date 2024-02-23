import UserForm from "@/components/UserForm";

function CreateUserForm() {
  return <UserForm method="POST" action="/api/users/add" />;
}

export default CreateUserForm;
