'use client'
import { CaseStudyType, CreateCaseStudy, UserPersona } from "@/crud/casestudy";
import { useEffect, useState } from "react";
import AddImage from "../AddImagesAndTags/AddImage";
import Image from "next/image";
import { PlusCircle, X } from "lucide-react";
import UserPersonaForm from "./UserPersonaForm";
import { CreateImageDTO } from "@/crud/DTOs";
import ListInput from "../ListInput";
import Notification from "../Notification";
import { Service } from "@prisma/client";

function CaseStudyForm({ method, action, initial, types }: { method: 'POST' | 'PUT', action: string,types: Service[] , initial?: CreateCaseStudy }) {
    const [notify, setNotify] = useState(false);
    const [notifyMessage, setNotifyMessage] = useState("");
    const [notifyType, setNotifyType] = useState<'success' | 'fail'>('fail');
    const [userPersonaForm, setUserPersonaForm] = useState(false);
      
    const [caseData, setCaseData] = useState<CreateCaseStudy>(initial || {
        serviceId: '',
        architecture: [],
        competetiveAnalysis: [],
        goals: [],
        images: [],
        keyLearning: "",
        preview: "",
        title: "",
        userFlow: [],
        userProblems: [],
        userPersonas: [],
        wireFrames: [],
        uniqueFeatures: "",
        possibleSolutions: [],
        problemStatement: "",
        userResearch: "",
        hifiDesign: []

    });

    // console.log(types);
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer your-access-token',
        };
        // Send the userData to your backend for creating the user
        console.log(caseData)
        const res = await fetch(`${action}`, { method: method, body: JSON.stringify(caseData), headers })
        let resJson = await res.json();

        if (res.status == 200) {
            setNotifyType('success');
            setNotifyMessage(resJson.message);
            setNotify(true);

        } else {
            setNotifyType('fail');
            setNotifyMessage(resJson.message);
            setNotify(true);

        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        setCaseData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };

    function handleListInput(name: string, value: string[]) {
        setCaseData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    }

    function handleImageChange(name: string, images: CreateImageDTO[]) {
        setCaseData(prevData => ({
            ...prevData,
            [name]: images
        }))
    }

    function addPersona(persona: UserPersona) {
        setCaseData(prevData => ({
            ...prevData,
            userPersonas: [...caseData.userPersonas, persona]
        }))
        setUserPersonaForm(false);
    }

    return (<>
        <div className="light:bg-gray-100 light:text-black dark:bg-gray-700 dark:text-gray-800  bg-gray-100 h-[95vh] max-h-screen flex items-center justify-center ">
            <div className="bg-white shadow-md rounded p-8 max-w-xl w-full max-h-full h-full">
                <h2 className="text-2xl font-semibold mb-4">{method === 'POST' ? 'Create' : 'Update'} Case study</h2>
                <form onSubmit={handleSubmit} className=" h-[90%]" >

                    <div className="overflow-y-auto h-full py-4 px-2">
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Title:</label>
                            <input
                                type="text"
                                name="title"
                                className="mt-1 p-2 border rounded w-full"
                                value={caseData.title}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Type:</label>
                            <select
                                name="serviceId"
                                className="mt-1 p-2 border rounded w-full"
                                value={caseData.serviceId|| ""}
                                onChange={handleInputChange}
                            >
                                <option disabled>Select Service</option>
                                {types.map((type, index) => (<option value={type.id} key={index}>{type.title}</option>))}
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Preview:</label>
                            <textarea
                                name="preview"
                                rows={7}
                                className="mt-1 p-2 border rounded w-full"
                                value={caseData.preview}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">problemStatement:</label>
                            <textarea
                                name="problemStatement"
                                rows={7}
                                className="mt-1 p-2 border rounded w-full"
                                value={caseData.problemStatement}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="mb-4">
                            <ListInput label="Goals" initial={caseData.goals} onChange={(values) => handleListInput('goals', values)} />
                        </div>
                        <div className="mb-4">
                            <ListInput label="Possible solutions" initial={caseData.possibleSolutions} onChange={(values) => handleListInput('possibleSolutions', values)} />
                        </div>
                        <div className="mb-4">
                            <ListInput label="User Problem " initial={caseData.userProblems} onChange={(values) => handleListInput('userProblems', values)} />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Understanding the problems:</label>
                            <div>
                                <textarea
                                    name="userResearch"
                                    rows={7}
                                    className="mt-1 p-2 border rounded w-full"
                                    value={caseData.userResearch}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Key Learnings:</label>
                            <div>
                                <textarea
                                    name="keyLearning"
                                    rows={7}
                                    className="mt-1 p-2 border rounded w-full"
                                    value={caseData.keyLearning}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                        <div className="mb-4 h-fit   flex-grow">
                            <label className="block text-sm font-medium text-gray-700">User Personas:</label>
                            <div>
                                {caseData.userPersonas?.map((user, index) => {
                                    return <div className={`flex flex-col w-14 h-fit bg-gray-600 gap-5 my-4 border-dotted border-2 p-2 `} key={index}>
                                        <div className="h-1/2">
                                            <Image src={user.image?.src as string} alt={``} height={500} width={500} ></Image>
                                        </div>
                                        <div className="justify-evenly">
                                            <div className="font-bold  text-white">{user.name}</div>
                                        </div>
                                    </div>
                                })}
                            </div>
                            <div className="w-full flex justify-center items-end  p-2">
                                <button type="button" onClick={() => setUserPersonaForm(true)} className="p-2 hover:shadow-lg hover:bg-blue-600 bg-blue-500 rounded-full" >
                                    <PlusCircle className=" text-white" />
                                </button>
                            </div>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Image 1 :</label>
                            <AddImage maxImages={1} defaultImages={caseData.images[0] ? [caseData.images[0]] : []} onImagesChange={(images) => setCaseData(prev => ({ ...prev, images: [images[0], ...prev.images.slice(1,)] }))} />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Image 2:</label>
                            <AddImage maxImages={1} defaultImages={caseData.images[1] ? [caseData.images[1]] : []} onImagesChange={(images) => setCaseData(prev => ({ ...prev, images: [...prev.images.slice(0, 1), images[0]] }))} />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Wireframes:</label>
                            <AddImage maxImages={5} defaultImages={caseData.wireFrames ? caseData.wireFrames : []} onImagesChange={(images) => handleImageChange("wireFrames", images)} />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">hifi designs:</label>
                            <AddImage maxImages={5} defaultImages={caseData.hifiDesign ? caseData.hifiDesign : []} onImagesChange={(images) => handleImageChange("hifiDesign", images)} />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">user flow:</label>
                            <AddImage maxImages={5} defaultImages={caseData.userFlow ? caseData.userFlow : []} onImagesChange={(images) => handleImageChange("userFlow", images)} />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">architecture Analysis:</label>
                            <AddImage maxImages={5} defaultImages={caseData.architecture ? caseData.architecture : []} onImagesChange={(images) => handleImageChange("architecture", images)} />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Competetive Analysis:</label>
                            <AddImage maxImages={1} defaultImages={caseData.competetiveAnalysis ? caseData.competetiveAnalysis : []} onImagesChange={(images) => handleImageChange("competetiveAnalysis", images)} />
                        </div>
                    </div>


                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
                    >
                        {method === 'POST' ? 'Create Case study' : 'Update Case study'}
                    </button>
                </form>
                <div className={`fixed container mx-auto flex flex-col  top-0 left-0 justify-center ${userPersonaForm ? '' : ' hidden'}`}>
                    <div className="absolute top-3 right-3 flex justify-end z-30">
                        <button type="button" className="self-end m-3" onClick={() => setUserPersonaForm(false)} ><X color="red" className="cursor-pointer" /></button>
                    </div>
                    <UserPersonaForm onSubmit={addPersona} />
                </div>
            </div>
            <Notification visible={notify} setVisible={setNotify} message={notifyMessage} type={notifyType}></Notification>

        </div>



    </>);
}

export default CaseStudyForm;