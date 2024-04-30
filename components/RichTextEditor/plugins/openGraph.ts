import { AstNode, Editor, TinyMCE } from "tinymce";



async function fetchOpenGraphData(data: { url: string, title: string, image: string, description: string }, editor: Editor, target?: HTMLElement) {
  try {

    const response = await fetch(`/api/fetchOG?url=${encodeURIComponent(data.url)}`);
    const { og, metadata } = await response.json();
    // console.log("og data",data);
    if (og["og:title"]) {
      let image: string = og["og:image"] ??  data.image;

      console.log(image);
      let description = og["og:description"] ?? data.description;
      const content = `
                <div contenteditable="false" data-image="${image}" data-description="${description}" data-url="${data.url}" data-title="${og["og:title"]}" data-element="og" class="og-link" style="border: 1px solid #ccc; max-width: 500px; margin: 10px; overflow: hidden; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
                    <div style="position: relative;">
                        <a href="${data.url}" target="_blank" style="text-decoration: none; color: inherit;">
                            <img src="${image}" alt="Preview" style="display: block; width: 100%; height: auto;">
                        </a>
                    </div>
                    <div style="padding: 15px;">
                        <a href="${data.url}" target="_blank" style="text-decoration: none; color: inherit;">
                            <h4 style="margin: 0;  font-size: 18px; font-weight: bold;">${og["og:title"]}</h4>
                            <p style="margin: 5px 0 10px; color: #333; font-size: 14px;">${description}</p>
                        </a>
                    </div>
                </div>
            `;
      if (target) {
        editor.selection.getNode().outerHTML = content;
      } 
      else {
        
        
        editor.insertContent(content);}
    } else {
      alert("No Open Graph data found.");
    }
  } catch (error) {
    console.error("Error fetching OG data:", error);
    alert("Failed to fetch Open Graph data.");
  }
}
export function openGraphPlugin(editor: Editor) {
  console.log("registerygin oprngraph");
  editor.ui.registry.addIcon(
    "opengraphIcon",
    `
   <svg width="24px" height="24px" viewBox="-11 -5.5 1035 1035"
    xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" fill="#000000">
    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
    <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
    <g id="SVGRepo_iconCarrier">
     <path fill="#000000" d="M499 245q-3 0 -162 92l-159 92l-17 -10q-19 -10 -24 -14q-7 -5 -8.5 -10.5t-2 -19t-2.5 -20.5t-8 -15q-20 -26 -52.5 -26t-51.5 25q-15 20 -11.5 47t23.5 42q12 10 33 12t34 -5q9 -4 14 -2.5t27 13.5l29 17v368l339 196l11 -6q75 -44 191.5 -110.5t120 -66.5t27.5 14 l23 13v20q0 27 15 44.5t41 21.5q21 2 39 -9t26.5 -30.5t3.5 -39.5q-8 -30 -35.5 -43t-54.5 0q-8 4 -13.5 2.5t-26.5 -12.5l-28 -16v-370l-170 -98q-169 -97 -171 -96zM480 314v96v96h-8q-38 -2 -64.5 -6.5t-26.5 -8t12 -32.5t19.5 -45t27.5 -46t31 -43zM526 324q3 0 8 6 q4 5 14 20l5 7q20 29 45 81t20 56q-1 2 -22.5 5t-48.5 5l-26 3v-112v-54q1 -17 5 -17zM590 340l25 15q55 31 107 61.5t52 32.5t-32 13q-81 30 -84 21q-17 -48 -28 -72t-28 -51zM407 344v0.5t-9 14.5q-11 18 -25.5 48t-22.5 53q-10 28 -11 28l-30 -9q-27 -8 -54.5 -18 t-27.5 -12.5t90 -54.5q85 -49 90 -50zM65 353q7 0 13.5 4.5t9.5 12t-1.5 18.5t-12.5 13q-22 9 -33 -12q-3 -7 -3.5 -11t3 -10.5t10 -10.5t14.5 -4zM201 484q4 0 31.5 11t61.5 21t35 10.5t-3 29.5l-8 61h-58q-58 0 -60.5 -3t-2 -66.5t3.5 -63.5zM795 485q3 0 4 11t1 54v67 h-59q-58 0 -60.5 -2.5t-2.5 -19.5t-4 -43l-5 -26l18 -5q19 -5 59 -19zM630 534l4 24q4 24 5 40l1 17l-75 2l-6 -11q-4 -8 -17 -20.5t-18 -12.5q-1 0 -2 -4.5t-1 -10.5v-15h24q25 0 55 -5zM375 537q9 0 31 2q32 4 53 4h21v14q0 9 -2.5 13t-11.5 9q-6 4 -12.5 11t-9.5 12 l-8 15h-78l3 -25q2 -20 5 -36.5t5 -18.5h4zM500 609q9 0 16 5.5t8.5 13.5t-2.5 17t-11 12q-9 4 -12 3q-15 -2 -21 -15t0.5 -24.5t21.5 -11.5zM318 653l2 16l6 45q3 22 1 28.5t-11 6.5q-5 0 -42.5 12t-56.5 20l-20 8l2 -134zM800 653v68q0 68 -1 68l-11 -5q-8 -5 -46 -18 t-56 -17l-16 -4l3 -21q3 -21 5 -45l2 -24zM383 653h5h48l8 13q3 6 9.5 12.5t12.5 10.5q9 6 11.5 10t2.5 13v14l-39 2q-40 3 -55 6h-2q-9 2 -12 1t-4.5 -7.5t-3.5 -26.5l-3 -15q-2 -18 -1.5 -23.5t5 -7.5t18.5 -2zM565 653h36q37 0 38.5 3t-2 32t-6.5 39l-2 9l-31 -4 q-32 -5 -54 -5h-23v-14q0 -10 2 -14t12 -10q6 -4 12.5 -10.5t9.5 -12.5zM480 764v95q0 95 -2.5 95t-27 -36t-35.5 -59q-15 -28 -25 -54.5t-8 -28.5t26 -5t49 -5zM521 764l23 2q20 1 46.5 5t28.5 5.5t-14.5 40t-28.5 60.5q-19 31 -37 55l-18 24v-192zM340 782l8 25 q17 50 44 94q15 25 14 26t-89.5 -50.5t-89 -54t27.5 -13t59 -19.5zM663 784q4 0 22 5q24 7 56.5 19t32.5 14t-23 16l-90 51q-67 39 -67 36.5t8 -13.5q12 -18 29.5 -57t26.5 -67q1 -4 5 -4zM935 866q10 0 17.5 8t8 18.5t-7 18t-18 7t-18 -7.5t-7.5 -17q0 -8 8.5 -17.5 t16.5 -9.5z"></path> </g></svg>
    `,
  );
  editor.editorCommands.addCommand("openGraph", (active) => {
    openGraphModal(editor,);

  });
  editor.editorCommands.addCommand("openGraphActive", (active) => {

  });
  editor.ui.registry.addButton("opengraph", {
    text: "OG",
    tooltip: "Open Graph",
    icon: "opengraphIcon",
    enabled: true,
    onSetup: function (api) {

      editor.on("ObjectSelected", (event) => {
        const target = event.target as HTMLElement;
        console.log(target.getAttribute("data-element"), event);

        if(!target || !target.getAttribute) return
        console.log(target.getAttribute("data-element"));
        if(target.getAttribute("data-element") === 'og')  openGraphModal(editor,target);
      })

      return (api) => { };
    },
    onAction: () => openGraphModal(editor),
  });
}

function openGraphModal(editor: Editor, target?: HTMLElement) {
  let url = "", title = "", description = "", image = "";
  if (target) {
    url = target.getAttribute("data-url") || "";
    title = target.getAttribute("data-title") || "";
    description = target.getAttribute("data-description") || "";
    image = target.getAttribute("data-image") || "";
  }
  const dialog = document.getElementById(
    "openGraph-modal",
  ) as HTMLDialogElement;
  if (dialog) {
    dialog.show();
    (document.getElementById("og_url") as HTMLInputElement).value = url;
    (document.getElementById("og_title") as HTMLInputElement).value = title;
    (document.getElementById("og_description") as HTMLInputElement).value = description;
    (document.getElementById("og_image") as HTMLInputElement).value = image;


    return;
  }
  const newModal = document.createElement("dialog");
  newModal.id = "openGraph-modal";
  newModal.classList.add(
    "w-screen",
    "h-screen",
    "fixed",
    "top-0",
    "left-0",
    "p-3",
    "z-[9999]",
    "bg-black",
    "backdrop-blur-lg",
    "bg-opacity-50",
  );
 
  newModal.insertAdjacentHTML(
    "afterbegin",
    `
                <div  class="w-fit mx-auto h-full z-50 flex justify-center items-center p-10">
                    <div class="relative bg-white shadow-md rounded p-8 container w-full overflow-auto max-h-screen z-50 flex flex-col justify-center">
                        <div class="absolute top-2 right-2 hover:text-red-500">
                        <button id="opengraph-close" class="">❌</button></div>
                        <h2>Open Graph</h2>
                        <div class="my-4">
                            <label class="text-base m-0 text-gray-700">link</label>
                            <input defaultValue="${url}" id="og_url" rows="30" class="w-full h-fit border rounded focus:outline-blue-200"></input>
                        </div>
                        <div class="my-4 m-0 text-gray-700">
                            <label class="text-base rounded focus:outline-blue-200">Title</label>
                            <input defaultValue="${title}" id="og_title" rows="30" class="w-full h-fit border"></input>
                        </div>
                        <div class="my-4 m-0 text-gray-700">
                            <label class="text-base rounded focus:outline-blue-200">Description</label>
                            <textarea defaultValue="${description}" id="og_description" rows="5" class="w-full h-fit border"></textarea>
                        </div>
                        <div class="my-4 m-0 text-gray-700">
                            <label class="text-base rounded focus:outline-blue-200">image</label>
                            <input defaultValue="${image}" id="og_image" rows="30" class="w-full h-fit border"></input>
                        </div>
                        <button id="add-link" class="flex justify-center items-center gap-3 w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300">
                          <svg id="og-loading" aria-hidden="true" class="inline aria-hidden:hidden" width="15" height="15" viewBox="0 0 60 20" xmlns="http://www.w3.org/2000/svg">
                            <circle class="dot animate-pulse delay-75" cx="10" cy="10" r="5"></circle>
                            <circle class="dot animate-pulse delay-150 " cx="30" cy="10" r="5"></circle>
                            <circle class="dot  animate-pulse delay-200 " cx="50" cy="10" r="5"></circle>
                          </svg>
                        Add
                        </button>
                    </div>
                
                </div> 
            
            `,
  );

  document.body.appendChild(newModal);
  newModal.show();

  document.getElementById("add-link")?.addEventListener("click", async () => {
    const url = (document.getElementById("og_url") as HTMLInputElement).value;
    const title = (document.getElementById("og_title") as HTMLInputElement).value;
    const description = (document.getElementById("og_description") as HTMLInputElement).value;
    const image = (document.getElementById("og_image") as HTMLInputElement).value;

    const loading = document.getElementById("og-loading") as HTMLElement;
    loading.ariaHidden ="false";
    if (url.trim()) await fetchOpenGraphData({ url, title, image, description }, editor, target);
    loading.ariaHidden ="true";

    newModal.close();
  });
  document.getElementById("opengraph-close")?.addEventListener("click", () => {
    newModal.close();
  });
}
