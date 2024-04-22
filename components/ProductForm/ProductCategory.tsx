'use client';
import { useState } from "react";
import Modal from "../shared/Modal";
import { X } from "lucide-react";
import CategoryForm from "../CategoryForm";

function ProductCategoryForm() {
    const [showModal, setShowModal] = useState(false);
    return (<>

        <button type="button" onClick={() => setShowModal(true)} className="text-sm text-slate-500" >edit categories</button>
        <Modal show={showModal} setShow={setShowModal} >

            <div className="relative flex p-5 w-fit bg-gray-100"   >
                <button type="button" onClick={() => setShowModal(false)} className="absolute right-2 top-2"><X /></button>
                <div>
                    <CategoryForm action="" method="POST" />
                </div>
            </div>
        </Modal>


    </>


    );
}

export default ProductCategoryForm;