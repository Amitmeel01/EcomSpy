


"use client";

import { FormEvent, Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Image from 'next/image';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';


const fetchResults:any = async (id: string) => {
  const api_key = "28887182-ae2c-4c0b-b25a-a57fff37e651";
  

  const res = await fetch(`https://api.brightdata.com/dca/dataset?id=${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${api_key}`
    }
  });

  

  const data = await res.json();

  if (data.status === "building" || data.status === "collecting") {
    console.log("Not complete");
    return fetchResults(id);
  }

  console.log("data is here", data);
  return data;
};

const ItemSearch = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [input, setInput] = useState('');
  const [results, setResults] = useState(null);
  const router=useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // const data = await fetchResults(input);
      // setResults(data); // Store the fetched data in state
      router.push('/items')
    } catch (error) {
      console.error("Failed to fetch results", error);
    } finally {
      setIsSubmitting(false);
      setInput('');
      closeModal();
      
    }
  };

  const openModal = () => setIsOpen(true);

  const closeModal = () => setIsOpen(false);

  return (
    <>
      <ToastContainer />
      <button
        type="button"
        className='ml-[330px] mt-1  lg:ml-[980px] sm:ml-[370px] max-sm:ml-[180px] max-md:ml-[0px] md:ml-[0px]'
        onClick={openModal}
      >
        <Image
          src='/assets/icons/search.svg'
          alt='search'
          width={28}
          height={28}
          className='text-white'
        />
      </button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" onClose={closeModal} className="dialog-container h-full">
          <div className="h-[400px] px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-50" />
            </Transition.Child>

            <span className="inline-block h-[400px] align-top" aria-hidden="true" />

            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="dialog-content">
                <div className="flex flex-col">
                  <div className="flex justify-between">
                    <div className="p-3 border border-gray-200 rounded-10">
                      <Image
                        src="/assets/icons/logo.svg"
                        alt="logo"
                        width={28}
                        height={28}
                      />
                    </div>

                    <Image
                      src="/assets/icons/x-close.svg"
                      alt="close"
                      width={24}
                      height={24}
                      className="cursor-pointer"
                      onClick={closeModal}
                    />
                  </div>

                  <h4 className="dialog-head_text">
                    Stay updated with product pricing with EcomSpy
                  </h4>
                </div>

                <form className="flex flex-col mt-5" onSubmit={handleSubmit}>
                  <div className="dialog-input_container">
                    <input
                      required
                      type="text"
                      id="search"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="search amazon product.."
                      className='dialog-input'
                    />
                  </div>

                  <button type="submit" className="dialog-btn">
                    {isSubmitting ? 'Searching...' : 'Search'}
                  </button>
                </form>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

      {results && (
        <div className="results-container">
          {/* Render your search results here */}
          {/* Example: */}
          <pre>{JSON.stringify(results, null, 2)}</pre>
        </div>
      )}
    </>
  );
};

export default ItemSearch;
