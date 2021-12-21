// Import the GitHub icon that is used in the button
import githubIcon from '@iconify/icons-simple-icons/github';
// Import the "type" called "NextPage".
// Types are used to figure out what an object might contain.
// In this case, the "NextPage" type tells both us and the program that we're making a webpage.
import type { NextPage } from 'next';

// Import some useful components to use throughout the page.
import { Button, Head } from '../components';

// The main function for the page.
// This function is run when the page is loaded, and renders the page to send to your browser.
const Page: NextPage = () => {
    return (
        // This is our root element, containing the entire page.
        // The "className" property is used to add CSS classes to the element.
        // In our case, we want the text color to be white, so we add the "text-white" class.
        // And we want the background color to be the purple-ish color apart of Erisly's colors, so we add the "bg-erisly-600" class.
        <div className="text-white bg-erisly-600">
            {/*
                Every page should contain a "Head" element.
                This is imported earlier from the components on line 9. (This is important)
                This contains special metadata information that tells the Browser and other sites (like Discord) what the page is about.
            */}
            <Head description="This is an example Erisly.moe page" title="Example Page" />

            {/*
                This is a "main" element, where the main content of the page will be.
                We add a bunch of CSS classes to make our content centered in the middle of the screen.
            */}
            <main className="flex flex-col items-center justify-center flex-1 min-h-screen px-8 text-center">
                {/*
                    We write some text using "p" (paragraph) elements.
                    The first line has a class to make it bigger.
                */}
                <p className="text-2xl">This is an example page for Erisly.moe</p>
                <p>Check out the source code to see how this simple page works!</p>

                {/*
                    We can also use "Button" components to make buttons.
                    This is imported earlier from the components on line 9.
                    This is a button that links to the GitHub repository of this page.
                    It uses the GitHub icon we imported on line 2.
                */}
                <Button
                    className="mt-8 text-xl font-bold"
                    content="Explore"
                    href="https://github.com/erisly/moe/tree/main/pages/example.tsx"
                    icon={githubIcon}
                    iconSize={32}
                    subClassName="button-github"
                />
            </main>
        </div>
    );
};

// Finally, we export the page.
// This is what tells the program that our "Page" function written above is the main function for this file.
// Without this, the program won't know what to load from this file.
export default Page;
