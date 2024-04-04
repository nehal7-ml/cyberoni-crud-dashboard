'use client'
import { PlusCircle, X } from "lucide-react";
import { useState } from "react";
import Modal from "../shared/Modal";
import ListInput from "../ListInput";
import { CreateCategory } from "@/crud/DTOs";
import FloatingLabelInput from "../shared/FloatingLabelInput";
import { toast } from "../Notification";

function CategoryForm({ onAddCategory }: { onAddCategory: (category: { name: string; id: string, children: { name: string; id: string }[] }) => void }) {

    const [openForm, setOpenForm] = useState(false);
    const [categoryData, setCategoryData] = useState<CreateCategory>({
        name: "",
        children: []
    });

    async function submit() {

        console.log(categoryData);

        const res = await fetch(`/api/blogs/categories/add`, {
            method: 'POST',
            body: JSON.stringify(categoryData),
        });
        let resJson = await res.json();
        
        if (res.status == 200) {
            const data = resJson.data
            onAddCategory(data);
            toast(`${resJson.message}`, {
                autoClose: 5000,
                type: "success",
            });

        } else {
            toast(`${resJson.message}`, {
                autoClose: 5000,
                type: "error",
            });
        }
    }
    return (<div>

        <Modal setShow={setOpenForm} show={openForm}>
            <div className="relative flex flex-col gap-4 p-4 bg-gray-100 rounded-md max-w-md">
                <button
                    type="button"
                    onClick={() => setOpenForm(false)}
                    className="absolute right-2 top-2 hover:text-red-500"
                >
                    <X></X>
                </button>
                <FloatingLabelInput placeholder="Category" type="text" name="category" value={categoryData.name} onChange={(e) => setCategoryData({ ...categoryData, name: e.target.value })} />
                <ListInput initial={[]} label="Subcategories" onChange={(data) => (setCategoryData({ ...categoryData, children: data.map((item) => ({ name: item })) }))} />
                <button onClick={submit} type="button"
                    className="flex w-fit items-end justify-center gap-3 rounded bg-blue-500 p-2 text-white">Add Category</button>
            </div>
        </Modal>


        <button
            onClick={() => (
                setOpenForm(true)
            )}
            type="button"
            className="flex w-fit items-end justify-center gap-3 rounded bg-blue-500 p-2 text-white"
        >
            <PlusCircle />
            Add Categories
        </button>

    </div>);
}

export default CategoryForm;