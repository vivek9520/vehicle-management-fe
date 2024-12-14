"use client"
import { useRouter } from 'next/navigation';

const CreateServicePage = () => {
    const router = useRouter();
    // const { id } = router.query;  // Access the dynamic 'id' from the URL

    return (
        <div>
            {/* <h1>Service ID: {id}</h1> */}
            {/* Add the component logic for the page here */}
        </div>
    );
};

export default CreateServicePage;
