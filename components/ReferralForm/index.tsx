'use client'
import { CreateReferralDTO } from "@/crud/referral";
import { CreateImageDTO } from "@/crud/DTOs";
import { CreateTagDTO } from "@/crud/tags";
import { EventStatus, ReferralPriority, ReferralType } from "@prisma/client";
import React, { FormEvent, useEffect, useState } from 'react';
import Notification, { NotificationType } from "@/components/Notification";
import { redirect, useRouter } from "next/navigation";



const ReferralForm = ({ method, action, initial }: { method: 'POST' | 'PUT', action: string, initial?: CreateReferralDTO }) => {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL as string;

    const [notify, setNotify] = useState(false);
    const [notifyMessage, setNotifyMessage] = useState("");
    const [notifyType, setNotifyType] = useState<'success' | 'fail'>('fail');
    const [invalidLink, setInvalidLink] = useState(false);
    const [linkType, setLinkType] = useState<'External' | 'Internal'>(initial?.link.includes(appUrl)? 'Internal': 'External');
    const [referralData, setReferralData] = useState<CreateReferralDTO>(initial? {
        ...initial,
        link: initial?.link.includes(appUrl)? `${initial.link.replace(appUrl,'')}`: initial.link
    } : {
        campaignId: '',
        description: '',
        click: 0,
        expires: new Date(),
        fallback: '',
        link: '',
        prefix: '',
        priority: ReferralPriority.LOW,
        type: ReferralType.REDIRECT,
        redirect: ''
    });
    const [date, setDate] = useState(((initial?.expires) || (new Date())).toISOString().split('T')[0]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        if (name === 'expires') {
            console.log(new Date(value));
            setReferralData(prevData => ({
                ...prevData,
                expires: new Date(value),
            }));

        } 
        else {

            setReferralData(prevData => ({
                ...prevData,
                [name]: value,
            }));
        }

    };
    const router = useRouter()

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();


        

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer your-access-token',
        };
        // Send the userData to your backend for creating the user
        const payload =  {...referralData}

        try {
            if(linkType ==='Internal') {
                Object.assign(payload, {
                    link: `${appUrl}${referralData.link}`
                })
            }
        } catch (error) {
            return
        }
        console.log(payload);

        const res = await fetch(`${action}`, { method, body: JSON.stringify(payload), headers })
        let resJson = await res.json();

        if (res.status === 200) {
            message('success', resJson.message)
            router.refresh()
            window.location.reload()

        } else {
            if(linkType ==='Internal') {
                referralData.link = `${referralData.link.replace(appUrl,'')}`
            }

            message('fail', resJson.message)

            if(res.status===406) {
                setInvalidLink(true)
            }

        }
    };

    function message(type: NotificationType, message: string) {
        setNotify(true);
        setNotifyType(type);
        setNotifyMessage(message);
        setTimeout(() => { setNotify(false) }, 5000)

    }


    function handleLinkChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { value, name } = e.target
        setInvalidLink(false)
        if(linkType ==='External') {

            setReferralData(prevData => ({
                ...prevData,
                [name]: value,
            }));
        } 
        if(linkType ==='Internal') {
            setReferralData(prevData => ({
                ...prevData,
                [name]: `${value}`,
            }));
        }
        

    }



    return (
        <div className="light:bg-gray-100 light:text-black dark:bg-gray-700 dark:text-gray-800 min-h-screen flex items-center justify-center">
            <div className="bg-white shadow-md rounded p-8 max-w-4xl w-full overflow-scroll max-h-screen">
                <h2 className="text-2xl font-semibold mb-4">{method === 'POST' ? 'Create' : 'Update'} Referral {referralData.type}</h2>
                <form onSubmit={handleSubmit} className="">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Refrral type:</label>
                        <select
                            name="type"
                            className="mt-1 p-2 border rounded w-full  invalid:ring-2 invalid:ring-rose-600 invalid:text-rose-500 invalid:outline-red-500"
                            value={referralData.type}
                            onChange={handleInputChange}
                            required
                        >
                            {Object.values(ReferralType).map(type => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                    </div>


                    <div className="mb-4">
                        {<label className="block text-sm font-medium text-gray-700">{referralData.type === "REDIRECT" ? 'prefix' : 'username'} :</label>}
                        <input
                            type="text"
                            name="prefix"
                            className="mt-1 p-2 border rounded w-full invalid:ring-2 invalid:ring-rose-600 invalid:text-rose-500 invalid:outline-red-500"
                            value={referralData.prefix as string}
                            onChange={handleInputChange}
                            required
                        />
                    </div>



                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Expires :</label>
                        <input
                            type="date"
                            name="expires"
                            className="mt-1 p-2 border rounded w-full invalid:ring-2 invalid:ring-rose-600 invalid:text-rose-500 invalid:outline-red-500"
                            value={(date)}
                            required
                            onChange={(referral) => {
                                setDate(referral.target.value);
                                setReferralData(prev => ({ ...prev, date: new Date(referral.target.value) }))
                            }}
                        />
                    </div>

                    <div className="my-4">
                        <select
                            name="type"
                            className="mt-1 p-2 border rounded w-full  invalid:ring-2 invalid:ring-rose-600 invalid:text-rose-500 invalid:outline-red-500"
                            value={linkType}
                            onChange={(e) => setLinkType(e.target.value as ('External' | 'Internal'))}
                            required
                        >
                            <option value={'External'}>
                                Link to external Website
                            </option>
                            <option value={'Internal'}>
                                Internal
                            </option>
                        </select>

                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Redirect Link:</label>
                        <input
                            disabled
                            type="text"
                            name="redirect"
                            className="mt-1 p-2 border rounded w-full invalid:ring-2 invalid:ring-rose-600 invalid:text-rose-500 invalid:outline-red-500"
                            value={`${appUrl}${referralData.type === 'REDIRECT' ? `/referrals` : `/affiliate`}/${referralData.prefix}`}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Page To Link:</label>
                        <input
                            type="text"
                            name="link"
                            className={`mt-1 p-2 border rounded w-full ${invalidLink? 'ring-rose-600 text-rose-500 outline-red-500' : ''} invalid:ring-2 invalid:ring-rose-600 invalid:text-rose-500 invalid:outline-red-500`}
                            value={referralData.link}
                            onChange={handleLinkChange}
                            pattern={linkType=="External"? '^(ftp|http|https):\/\/[^ "]+$': '^\/.*$'}
                            title="Enter valid url: https://...(external)) or /..(internal)"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">fallback Link:</label>
                        <input
                            type="text"
                            name="fallback"
                            className="mt-1 p-2 border rounded w-full invalid:ring-2 invalid:ring-rose-600 invalid:text-rose-500 invalid:outline-red-500"
                            value={referralData.fallback}
                            onChange={handleLinkChange}
                            pattern={linkType=="External"? '^(ftp|http|https):\/\/[^ "]+$': '^\/.*$'}
                            title="Enter valid url: https://...(external)) or /..(internal)"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Refrral type:</label>
                        <select
                            name="type"
                            className="mt-1 p-2 border rounded w-full  invalid:ring-2 invalid:ring-rose-600 invalid:text-rose-500 invalid:outline-red-500"
                            value={referralData.priority}
                            onChange={handleInputChange}
                            required
                        >
                            {Object.values(ReferralPriority).map(priority => (
                                <option key={priority} value={priority}>
                                    {priority}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Description:</label>
                        <textarea
                            name="description"
                            rows={4} // Adjust the number of rows as needed
                            className="mt-1 p-2 border rounded w-full invalid:ring-2 invalid:ring-rose-600 invalid:text-rose-500 invalid:outline-red-500"
                            value={referralData.description}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">campaignId :</label>
                        <input
                            name="campaignId"
                            className="mt-1 p-2 border rounded w-full invalid:ring-2 invalid:ring-rose-600 invalid:text-rose-500 invalid:outline-red-500"
                            value={referralData.campaignId}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
                    >
                        {method === 'POST' ? 'Create' : 'Update'} Referral
                    </button>
                </form>
            </div>
            <Notification visible={notify} setVisible={setNotify} message={notifyMessage} type={notifyType}></Notification>

        </div>
    );
};

export default ReferralForm;
