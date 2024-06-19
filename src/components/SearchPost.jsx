

export default function SearchPost() {
    const search = () => {
        let search_input, post, a, i;
        search_input = document.getElementById("search").value.toLowerCase();
       
        post = document.getElementsByClassName(".textdata");
      
        for (i = 0; i < post.length; i++) {
          p = post[i].getElementsByTagName("p")[0];

          if (p.innerHTML.toLowerCase().indexOf(search_input) > -1) {
            p[i].style.display = "";
          } else {
            p[i].style.display = "none";
          }
        }
    }

    document.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && canSearch) {
            e.preventDefault();
            console.log("cliked");
            search();
            setCanSearch(false);
        }
    });

    return (
        <input 
            type="search" 
            placeholder="Search" 
            aria-label="Search" 
            id='search'
            className='bg-zinc-700 outline-zinc-400 outline-2 p-3 rounded text-sm w-full py-2 px-4 max-w-[210px] ' />

       
    )
}