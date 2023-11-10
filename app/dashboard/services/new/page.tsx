
import SerivceForm from "@/components/ServiceForm"
import React from 'react'

function CreateServcie() {


    return (
        <>
            <div className="light:bg-gray-100 light:text-black dark:bg-gray-700 dark:text-gray-800 min-h-screen flex items-center justify-center">
                <SerivceForm method="POST" action="/api/services/add" />
            </div>

        </>
    )
}

export default CreateServcie