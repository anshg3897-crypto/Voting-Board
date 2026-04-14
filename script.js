// ===== DEFAULT FEATURES =====
const defaultFeatures = [
  {
    id: 1,
    title: "Dark Mode Support",
    description: "Add a dark theme option so users can switch between light and dark mode. This is especially useful for late-night note-taking sessions and reduces eye strain.",
    tag: "UI/UX",
    status: "In Progress",
    votes: 47
  },
  {
    id: 2,
    title: "Export Notes to PDF",
    description: "Allow users to export their notes as a formatted PDF file. Useful for sharing notes with people who don't use Notevo or for archiving important information.",
    tag: "New Feature",
    status: "Planned",
    votes: 38
  },
  {
    id: 3,
    title: "Collaborative Editing",
    description: "Let multiple users edit the same note simultaneously, similar to Google Docs. Show live cursors and changes in real time without page refresh.",
    tag: "Enhancement",
    status: "Under Review",
    votes: 29
  },
  {
    id: 4,
    title: "Mobile App for iOS & Android",
    description: "Build a dedicated mobile application so users can access, create and edit notes on their phone. Offline support should be included.",
    tag: "New Feature",
    status: "Planned",
    votes: 21
  },
  {
    id: 5,
    title: "Reminder & Due Date on Notes",
    description: "Allow users to attach a reminder or due date to any note. Send a push notification or email when the reminder is triggered.",
    tag: "Enhancement",
    status: "Under Review",
    votes: 14
  }
];

// ===== STORAGE HELPERS =====
function loadFeatures() {
  const stored = localStorage.getItem("notevo_features");
  if (stored) {
    return JSON.parse(stored);
  }
  localStorage.setItem("notevo_features", JSON.stringify(defaultFeatures));
  return defaultFeatures;
}

function saveFeatures(features) {
  localStorage.setItem("notevo_features", JSON.stringify(features));
}

function loadVoted() {
  const stored = localStorage.getItem("notevo_voted");
  return stored ? JSON.parse(stored) : [];
}

function saveVoted(voted) {
  localStorage.setItem("notevo_voted", JSON.stringify(voted));
}

// ===== RENDER =====
function renderFeatures() {
  const features = loadFeatures();
  const voted = loadVoted();
  const statusFilter = document.getElementById("statusFilter").value;

  let filtered = features;
  if (statusFilter !== "all") {
    filtered = features.filter(f => f.status === statusFilter);
  }

  // Sort by votes descending
  filtered.sort((a, b) => b.votes - a.votes);

  const list = document.getElementById("featureList");

  if (filtered.length === 0) {
    list.innerHTML = `<div class="empty-state">No feature requests found for this filter.</div>`;
    return;
  }

  list.innerHTML = filtered.map(feature => {
    const hasVoted = voted.includes(feature.id);
    const statusClass = getStatusClass(feature.status);
    const tagHtml = feature.tag
      ? `<span class="badge badge-tag">${escapeHtml(feature.tag)}</span>`
      : "";

    return `
      <div class="feature-card" id="card-${feature.id}">
        <div class="card-body">
          <div class="card-top">
            <span class="card-title">${escapeHtml(feature.title)}</span>
            <span class="badge badge-status ${statusClass}">${feature.status}</span>
            ${tagHtml}
          </div>
          <p class="card-desc">${escapeHtml(feature.description)}</p>
        </div>
        <div class="vote-col ${hasVoted ? "voted" : ""}" onclick="toggleVote(${feature.id})">
          <div class="vote-arrow"></div>
          <span class="vote-count">${feature.votes}</span>
        </div>
      </div>
    `;
  }).join("");
}

function getStatusClass(status) {
  if (status === "In Progress") return "inprogress";
  if (status === "Planned") return "planned";
  if (status === "Under Review") return "review";
  return "";
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

// ===== VOTING =====
function toggleVote(id) {
  const features = loadFeatures();
  let voted = loadVoted();

  const feature = features.find(f => f.id === id);
  if (!feature) return;

  if (voted.includes(id)) {
    feature.votes = Math.max(0, feature.votes - 1);
    voted = voted.filter(v => v !== id);
    showToast("Vote removed");
  } else {
    feature.votes += 1;
    voted.push(id);
    showToast("Thanks for voting!");
  }

  saveFeatures(features);
  saveVoted(voted);
  renderFeatures();
}

// ===== SUBMIT FEATURE =====
function submitFeature() {
  const titleEl = document.getElementById("feat-title");
  const descEl = document.getElementById("feat-desc");
  const tagEl = document.getElementById("feat-tag");
  const errorEl = document.getElementById("errorMsg");

  const title = titleEl.value.trim();
  const description = descEl.value.trim();
  const tag = tagEl.value;

  if (!title) {
    errorEl.textContent = "Please enter a title for your feature request.";
    titleEl.focus();
    return;
  }
  if (!description) {
    errorEl.textContent = "Please add a short description.";
    descEl.focus();
    return;
  }
  errorEl.textContent = "";

  const features = loadFeatures();

  const duplicate = features.find(
    f => f.title.toLowerCase() === title.toLowerCase()
  );
  if (duplicate) {
    errorEl.textContent = "A feature with this title already exists.";
    return;
  }

  const newFeature = {
    id: Date.now(),
    title,
    description,
    tag: tag || "",
    status: "Under Review",
    votes: 0
  };

  features.push(newFeature);
  saveFeatures(features);

  titleEl.value = "";
  descEl.value = "";
  tagEl.value = "";

  renderFeatures();
  showToast("Feature request submitted!");
}

// Allow Enter key in title to submit
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("feat-title").addEventListener("keydown", (e) => {
    if (e.key === "Enter") submitFeature();
  });
  renderFeatures();
});

// ===== TOAST =====
let toastTimeout;
function showToast(message) {
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}