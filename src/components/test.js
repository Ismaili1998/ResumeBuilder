<time className="w-50 text-sm flex justify-start items-center gap-0 font-normal 
                leading-none text-gray-400 dark:text-gray-500">
    <input
        type="text"
        className="w-7 text-center text-gray-500 dark:text-gray-600 text-md 
                        focus:outline-none border-b-2 border-dashed"
        onChange={handleChange}
        value={date.month}
        name="month"
    />
    <span>/</span>
    <input
        type="text"
        className="w-12 text-center text-gray-500 dark:text-gray-600 text-md 
                        focus:outline-none border-b-2 border-dashed"
        onChange={handleChange}
        value={date.year}
        name="year"
    />
</time>