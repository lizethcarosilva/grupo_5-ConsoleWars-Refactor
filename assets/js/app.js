async function loadComponents() {
  if (window.location.protocol === "file:") {
    document.body.insertAdjacentHTML(
      "afterbegin",
      `<div class="alert alert-warning text-center m-0 rounded-0" role="alert">
        No abras el archivo directo. Usa <strong>Live Server</strong>
        o ejecuta en la carpeta del proyecto:<br>
        <code>python -m http.server 5500</code>
      </div>`
    );
    return;
  }

  const placeholders = [...document.querySelectorAll("[data-include]")];

  for (const el of placeholders) {
    const file = (el.getAttribute("data-include") || "")
      .replace(/\\/g, "/")
      .replace(/^(\.\.\/)+/, "")
      .replace(/^\.\//, "")
      .replace(/^\//, "");

    try {
      const response = await fetch(file);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status} al cargar ${file}`);
      }
      el.outerHTML = await response.text();
    } catch (error) {
      console.error(error);
      el.outerHTML = `<p class="text-danger text-center p-3">Error al cargar: ${file}</p>`;
    }
  }

  markActiveNavLink();
}

function markActiveNavLink() {
  const page = document.body.getAttribute("data-page");
  if (!page) return;

  document.querySelectorAll(".navbar .nav-link[data-page]").forEach((link) => {
    const isActive = link.getAttribute("data-page") === page;
    link.classList.toggle("active", isActive);
    if (isActive) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

document.addEventListener("DOMContentLoaded", loadComponents);
