import React from 'react';
import { useForm } from 'react-hook-form';
import { gql, useMutation } from '@apollo/client';
import toast, { Toaster } from 'react-hot-toast';
import { getSession } from '@auth0/nextjs-auth0';
import prisma from '../lib/prisma';

const CreateLinkMutation = gql`
    mutation (
        $title: String!
        $url: String!
        $imageUrl: String!
        $category: String!
        $description: String!
    ) {
        createLink(
            title: $title
            url: $url
            imageUrl: $imageUrl
            category: $category
            description: $description
        ) {
            title
            url
            imageUrl
            category
            description
        }
    }
`;

const Admin = () => {
    const [createLink, { data, loading, error }] =
        useMutation(CreateLinkMutation);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        const { title, url, category, description, image } = data;
        //const imageUrl = `https://my-awesome-links-bucket.s3.amazonaws.com/${image[0].name}`;
        const imageUrl = `https://i.imgur.com/a0PlRfo.jpeg`
        const variables = { title, url, category, description, imageUrl };
        try {
            toast.promise(createLink({ variables }), {
                loading: 'Creation en cours..',
                success: 'Point d\'intérêt créer avec succès!🎉',
                error: `Something went wrong 😥 Please try again -  ${error}`,
            });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="container mx-auto max-w-md py-12">
            <Toaster />
            <h1 className="text-3xl font-medium my-5">Créer un point d'interêt</h1>
            <form
                className="grid grid-cols-1 gap-y-6 shadow-lg p-8 rounded-lg"
                onSubmit={handleSubmit(onSubmit)}
            >
                <label className="block">
                    <span className="text-gray-700">Nom</span>
                    <input
                        placeholder="Nom"
                        name="title"
                        type="text"
                        {...register('title', { required: true })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                </label>
                <label className="block">
                    <span className="text-gray-700">Description</span>
                    <input
                        placeholder="Description"
                        {...register('description', { required: true })}
                        name="description"
                        type="text"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                </label>
                <label className="block">
                    <span className="text-gray-700">Site web</span>
                    <input
                        placeholder="https://example.com"
                        {...register('url', { required: true })}
                        name="url"
                        type="text"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                </label>
                <label className="block">
                    <span className="text-gray-700">Horaires</span>
                    <input
                        placeholder="Lundi : 8h - 12h / 13h - 17h"
                        {...register('category', { required: true })}
                        name="category"
                        type="text"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                </label>

                <button
                    disabled={loading}
                    type="submit"
                    className="my-4 capitalize bg-blue-500 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-600"
                >
                    {loading ? (
                        <span className="flex items-center justify-center">
              <svg
                  className="w-6 h-6 animate-spin mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" />
              </svg>
              Creating...
            </span>
                    ) : (
                        <span>Créer</span>
                    )}
                </button>
            </form>
        </div>
    );
};

export default Admin;

export const getServerSideProps = async ({ req, res }) => {
    const session = getSession(req, res)

    if (!session) {
        return {
            redirect: {
                permanent: false,
                destination: '/api/auth/login',
            },
            props: {},
        }
    }

    return {
        props: {},
    }
}