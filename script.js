const API_URL = "https://api.github.com/users/";

const userInput = document.getElementById("user-input");
const submitBtn = document.getElementById("submit-btn");
const alertMessage = document.getElementById("alert-message");
const profileDisplay = document.getElementById("profile-display");

const userAvatar = document.getElementById("user-avatar");
const userFullname = document.getElementById("user-fullname");
const userLogin = document.getElementById("user-login");
const userBio = document.getElementById("user-bio");
const viewProfileBtn = document.getElementById("view-profile-btn");

const locationInfo = document.getElementById("location-info");
const userLocation = document.getElementById("user-location");
const websiteInfo = document.getElementById("website-info");
const userWebsite = document.getElementById("user-website");
const twitterInfo = document.getElementById("twitter-info");
const userTwitter = document.getElementById("user-twitter");
const companyInfo = document.getElementById("company-info");
const userCompany = document.getElementById("user-company");

const userFollowers = document.getElementById("user-followers");
const userFollowing = document.getElementById("user-following");
const userRepos = document.getElementById("user-repos");
const reposList = document.getElementById("repos-list");

const fetchGitHubUser = async (username) => {
  try {
    const response = await fetch(API_URL + username);
    if (!response.ok) {
      throw new Error("User not found");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    showAlert();
    return null;
  }
};

const fetchUserRepos = async (username) => {
  try {
    const response = await fetch(`${API_URL}${username}/repos?sort=updated&per_page=8`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching repositories:", error);
    return [];
  }
};

const renderUserData = (user) => {
  userAvatar.src = user.avatar_url;
  userFullname.textContent = user.name || "N/A";
  userLogin.textContent = `@${user.login}`;
  userBio.textContent = user.bio || "This user has no bio.";
  viewProfileBtn.href = user.html_url;

  updateContactInfo(locationInfo, userLocation, user.location);
  updateContactInfo(companyInfo, userCompany, user.company);
  updateLink(websiteInfo, userWebsite, user.blog, user.blog);
  updateLink(
    twitterInfo,
    userTwitter,
    user.twitter_username ? `@${user.twitter_username}` : null,
    user.twitter_username ? `https://twitter.com/${user.twitter_username}` : null
  );

  userFollowers.textContent = user.followers;
  userFollowing.textContent = user.following;
  userRepos.textContent = user.public_repos;
};

const renderUserRepos = (repos) => {
  reposList.innerHTML = "";
  if (repos.length === 0) {
    reposList.innerHTML = "<p>No repositories found for this user.</p>";
    return;
  }

  repos.forEach((repo) => {
    const repoElement = document.createElement("div");
    repoElement.classList.add("repo-entry");

    repoElement.innerHTML = `
      <a href="${repo.html_url}" target="_blank" class="repo-title">
        <i class="fas fa-book-bookmark"></i>
        ${repo.name}
      </a>
      <p class="repo-description">${repo.description || "No description provided."}</p>
      <div class="repo-stats">
        ${repo.language ? `
          <span>
            <div class="repo-language-color" style="background-color: ${getLanguageColor(repo.language)}"></div>
            ${repo.language}
          </span>` : ''
        }
        <span><i class="fas fa-star"></i> ${repo.stargazers_count}</span>
        <span><i class="fas fa-code-fork"></i> ${repo.forks_count}</span>
      </div>
    `;
    reposList.appendChild(repoElement);
  });
};

const updateContactInfo = (container, element, value) => {
  if (value) {
    element.textContent = value;
    container.classList.remove("is-hidden");
  } else {
    container.classList.add("is-hidden");
  }
};

const updateLink = (container, element, text, url) => {
  if (text && url) {
    element.textContent = text;
    element.href = url.startsWith("http") ? url : `https://${url}`;
    container.classList.remove("is-hidden");
  } else {
    container.classList.add("is-hidden");
  }
};

const showAlert = () => {
  profileDisplay.classList.add("is-hidden");
  alertMessage.classList.remove("is-hidden");
};

const hideAlert = () => {
  alertMessage.classList.add("is-hidden");
};

const handleSearch = async () => {
  const username = userInput.value.trim();
  if (!username) return;

  hideAlert();
  profileDisplay.classList.add("is-hidden");

  const userData = await fetchGitHubUser(username);

  if (userData) {
    const reposData = await fetchUserRepos(username);
    renderUserData(userData);
    renderUserRepos(reposData);
    profileDisplay.classList.remove("is-hidden");
  }

  userInput.value = "";
};

const getLanguageColor = (language) => {
  const colors = {
      "JavaScript": "#f1e05a", "Python": "#3572A5", "HTML": "#e34c26",
      "CSS": "#563d7c", "Java": "#b07219", "TypeScript": "#3178c6",
      "C#": "#178600", "PHP": "#4F5D95", "C++": "#f34b7d",
      "C": "#555555", "Shell": "#89e051", "Ruby": "#701516", "Go": "#00ADD8"
  };
  return colors[language] || "#cccccc";
};

submitBtn.addEventListener("click", handleSearch);
userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    handleSearch();
  }
});