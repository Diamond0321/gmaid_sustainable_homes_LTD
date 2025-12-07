const ADMIN_PASSWORD = "admin123" // Change this to your desired password

// Initialize properties from localStorage
function initializeProperties() {
  if (!localStorage.getItem("properties")) {
    localStorage.setItem(
      "properties",
      JSON.stringify([
        {
          id: 1,
          name: "Modern Downtown Apartment",
          location: "Downtown City Center",
          price: 450000,
          description:
            "Beautiful modern apartment with stunning city views, 2 bedrooms, 2 bathrooms, and high-end finishes.",
          image:
            'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%232563eb" width="400" height="300"/%3E%3Ctext x="50%" y="50%" font-size="24" fill="white" text-anchor="middle" dy=".3em"%3EModern Downtown Apartment%3C/text%3E%3C/svg%3E',
        },
        {
          id: 2,
          name: "Suburban Family Home",
          location: "Quiet Residential Area",
          price: 550000,
          description:
            "Spacious 4-bedroom family home with a large yard, perfect for growing families. Recently renovated.",
          image:
            'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23f97316" width="400" height="300"/%3E%3Ctext x="50%" y="50%" font-size="24" fill="white" text-anchor="middle" dy=".3em"%3ESuburban Family Home%3C/text%3E%3C/svg%3E',
        },
        {
          id: 3,
          name: "Luxury Beach Villa",
          location: "Oceanfront Paradise",
          price: 1200000,
          description:
            "Exclusive beachfront villa with private beach access, infinity pool, and breathtaking ocean views.",
          image:
            'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%2306b6d4" width="400" height="300"/%3E%3Ctext x="50%" y="50%" font-size="24" fill="white" text-anchor="middle" dy=".3em"%3ELuxury Beach Villa%3C/text%3E%3C/svg%3E',
        },
      ]),
    )
  }
}

// Display properties on properties page
function displayProperties() {
  const container = document.getElementById("propertiesContainer")
  if (!container) return

  const properties = JSON.parse(localStorage.getItem("properties")) || []

  container.innerHTML = properties
    .map(
      (property) => `
        <div class="property-card" onclick="openPropertyModal(${property.id})">
            <img src="${property.image}" alt="${property.name}" class="property-image">
            <div class="property-info">
                <h3 class="property-title">${property.name}</h3>
                <p class="property-location">${property.location}</p>
                <p class="property-price">$${property.price.toLocaleString()}</p>
                <button class="view-details-btn">View Details</button>
            </div>
        </div>
    `,
    )
    .join("")
}

// Open property modal
function openPropertyModal(propertyId) {
  const properties = JSON.parse(localStorage.getItem("properties")) || []
  const property = properties.find((p) => p.id === propertyId)

  if (property) {
    document.getElementById("modalImage").src = property.image
    document.getElementById("modalTitle").textContent = property.name
    document.getElementById("modalLocation").textContent = "📍 " + property.location
    document.getElementById("modalPrice").textContent = "$" + property.price.toLocaleString()
    document.getElementById("modalDescription").textContent = property.description
    document.getElementById("propertyModal").style.display = "block"
  }
}

// Close modal
document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("propertyModal")
  if (modal) {
    const closeBtn = modal.querySelector(".close")
    closeBtn.onclick = () => {
      modal.style.display = "none"
    }

    window.onclick = (event) => {
      if (event.target === modal) {
        modal.style.display = "none"
      }
    }
  }

  displayProperties()
  initializeAdmin()
})

// Admin Panel Functions
function validateAdminPassword() {
  const passwordInput = document.getElementById("adminPassword")
  const password = passwordInput.value

  if (password === ADMIN_PASSWORD) {
    document.getElementById("loginOverlay").style.display = "none"
    document.getElementById("adminPanel").style.display = "block"
    displayUploadedProperties()
  } else {
    alert("Incorrect password. Please try again.")
    passwordInput.value = ""
  }
}

// Allow Enter key for password submission
document.addEventListener("DOMContentLoaded", () => {
  const passwordInput = document.getElementById("adminPassword")
  if (passwordInput) {
    passwordInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") validateAdminPassword()
    })
  }
})

// Handle property form submission
function initializeAdmin() {
  const form = document.getElementById("propertyForm")
  if (!form) return

  form.addEventListener("submit", (e) => {
    e.preventDefault()

    const imageInput = document.getElementById("propertyImage")
    const file = imageInput.files[0]

    if (!file) {
      alert("Please select an image")
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const properties = JSON.parse(localStorage.getItem("properties")) || []

      const newProperty = {
        id: Date.now(),
        name: document.getElementById("propertyName").value,
        location: document.getElementById("propertyLocation").value,
        price: Number.parseInt(document.getElementById("propertyPrice").value),
        description: document.getElementById("propertyDescription").value,
        image: e.target.result,
      }

      properties.push(newProperty)
      localStorage.setItem("properties", JSON.stringify(properties))

      // Reset form
      form.reset()
      document.getElementById("imagePreview").innerHTML = ""

      displayUploadedProperties()
      alert("Property added successfully!")
    }

    reader.readAsDataURL(file)
  })

  // Image preview
  const imageInput = document.getElementById("propertyImage")
  if (imageInput) {
    imageInput.addEventListener("change", (e) => {
      const file = e.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const preview = document.getElementById("imagePreview")
          preview.innerHTML = `<img src="${e.target.result}" alt="Preview">`
        }
        reader.readAsDataURL(file)
      }
    })
  }
}

// Display uploaded properties in admin panel
function displayUploadedProperties() {
  const listContainer = document.getElementById("uploadedList")
  if (!listContainer) return

  const properties = JSON.parse(localStorage.getItem("properties")) || []

  listContainer.innerHTML = properties
    .map(
      (property) => `
        <div class="property-item">
            <img src="${property.image}" alt="${property.name}">
            <h3>${property.name}</h3>
            <p><strong>Location:</strong> ${property.location}</p>
            <p><strong>Price:</strong> $${property.price.toLocaleString()}</p>
            <button class="delete-btn" onclick="deleteProperty(${property.id})">Delete</button>
        </div>
    `,
    )
    .join("")
}

// Delete property
function deleteProperty(propertyId) {
  if (confirm("Are you sure you want to delete this property?")) {
    let properties = JSON.parse(localStorage.getItem("properties")) || []
    properties = properties.filter((p) => p.id !== propertyId)
    localStorage.setItem("properties", JSON.stringify(properties))
    displayUploadedProperties()
    alert("Property deleted successfully!")
  }
}
