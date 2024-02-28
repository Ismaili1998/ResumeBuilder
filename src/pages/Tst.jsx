import React from 'react'

export default function Tst() {
    return (
        <div>
            <section class="h-screen flex items-center justify-center bg-cover bg-center" className="background-image: url('https://placekitten.com/1920/1080');">
                <div class="text-center text-white">
                    <h1 class="text-4xl font-bold mb-4">Welcome to Our Site</h1>
                    <p class="text-lg mb-8">Discover amazing things here</p>
                    <a href="#features" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">Learn More</a>
                </div>
            </section>

            <section id="features" class="py-16 bg-white">
                <div class="container mx-auto text-center">
                    <h2 class="text-3xl font-bold mb-8">Key Features</h2>
                </div>
            </section>

            <footer class="bg-gray-800 text-white text-center py-4">
                <p>&copy; 2024 Your Company. All rights reserved.</p>
            </footer>
        </div>
    )
}
