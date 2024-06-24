const Contact = () => {
  return (
    <section id="contact">
      <div className="mx-auto max-w-7xl px-8 py-20 lg:px-4 lg:py-8 sm:px-6 sm:py-16">
        <div className="mb-16 text-center">
          <p className="text-base font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-200">
            Contact
          </p>
          <h2 className="font-heading mb-4 font-bold tracking-tight text-gray-900 dark:text-white text-5xl sm:text-3xl">
            Get in Touch
          </h2>
        </div>

        <div className="mx-auto flex items-center">
          <ul className="md:mb-0 mb-6 flex justify-between gap-10 md:flex-col w-max  mx-auto">
            <li className="flex">
              <div className="flex h-10 w-10 items-center justify-center rounded bg-blue-900 text-gray-50">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6"
                >
                  <path d="M9 11a3 3 0 1 0 6 0a3 3 0 0 0 -6 0"></path>
                  <path d="M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0z"></path>
                </svg>
              </div>
              <div className="ml-4 mb-4">
                <h3 className="mb-2 text-lg font-medium leading-6 text-gray-900 dark:text-white">
                  Our Address
                </h3>
                <p className="text-gray-600 dark:text-slate-400">
                  1230 Maecenas Street Donec Road
                </p>
                <p className="text-gray-600 dark:text-slate-400">
                  New York, EEUU
                </p>
              </div>
            </li>
            <li className="flex">
              <div className="flex h-10 w-10 items-center justify-center rounded bg-blue-900 text-gray-50">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6"
                >
                  <path d="M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2"></path>
                  <path d="M15 7a2 2 0 0 1 2 2"></path>
                  <path d="M15 3a6 6 0 0 1 6 6"></path>
                </svg>
              </div>
              <div className="ml-4 mb-4">
                <h3 className="mb-2 text-lg font-medium leading-6 text-gray-900 dark:text-white">
                  Contact
                </h3>
                <p className="text-gray-600 dark:text-slate-400">
                  Mobile: +1 (123) 456-7890
                </p>
                <p className="text-gray-600 dark:text-slate-400">
                  Mail: tailnext@gmail.com
                </p>
              </div>
            </li>
            <li className="flex">
              <div className="flex h-10 w-10 items-center justify-center rounded bg-blue-900 text-gray-50">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6"
                >
                  <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0"></path>
                  <path d="M12 7v5l3 3"></path>
                </svg>
              </div>
              <div className="ml-4 mb-4">
                <h3 className="mb-2 text-lg font-medium leading-6 text-gray-900 dark:text-white">
                  Working hours
                </h3>
                <p className="text-gray-600 dark:text-slate-400">
                  Monday - Friday: 08:00 - 17:00
                </p>
                <p className="text-gray-600 dark:text-slate-400">
                  Saturday &amp; Sunday: 08:00 - 12:00
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Contact;
