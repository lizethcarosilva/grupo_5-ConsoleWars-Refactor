async function loadComponents() {
  if (window.location.protocol === "file:") {
    document.body.insertAdjacentHTML(
      "afterbegin",
      `<div class="alert alert-warning text-center m-0 rounded-0" role="alert">
        No abras el archivo directo. Usa <strong>Live Server</strong>
        o ejecuta: <code>python -m http.server 5500</code>
      </div>`
    );
    return;
  }

  const placeholders = document.querySelectorAll("[data-include]");

  await Promise.all(
    [...placeholders].map(async (el) => {
      const file = el.getAttribute("data-include");
      try {
        const response = await fetch(file);
        if (!response.ok) {
          throw new Error(`No se pudo cargar ${file}`);
        }
        el.outerHTML = await response.text();
      } catch (error) {
        console.error(error);
        el.innerHTML = `<p class="text-danger text-center p-3">Error al cargar: ${file}</p>`;
      }
    })
  );

  markActiveNavLink();
}

function markActiveNavLink() {
  const page = document.body.getAttribute("data-page");
  if (!page) return;

  document.querySelectorAll(".barraNavegacion a[data-page]").forEach((link) => {
    link.classList.toggle("active", link.getAttribute("data-page") === page);
  });
}

document.addEventListener("DOMContentLoaded", loadComponents);
