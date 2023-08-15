"use strict";

const result = document.getElementById("result");

const input = document.getElementById("input");
const btn = document.getElementById("search__btn");

const user = document.getElementById("user");
const username = document.getElementById("username");
const joined = document.getElementById("date");
const repos = document.getElementById("repo");
const followers = document.getElementById("follower");
const followings = document.getElementById("following");
const bio = document.getElementById("bio");
const img = document.getElementById("img");

const repo__links = document.getElementById("repo__links");

const loading = document.getElementById("loading");

let dev;
let repositories = [];

//https://api.github.com/users/${searchValue}

const getUser = (searchValue) => {
  fetch(`https://api.github.com/users/${searchValue}`)
    .then((resp) => {
      if (resp.status !== 200) {
        throw new Error();
      }
      return resp.json();
    })
    .then((data) => {
      dev = data;
      loading.classList.replace("hidden", "block");
      displayInfo(dev);
    })
    .catch((err) => console.log(err));
};

const getRepos = (searchValue) => {
  fetch(`https://api.github.com/users/${searchValue}/repos`)
    .then((resp) => resp.json())
    .then((data) => {
      repositories = data.slice(0, 10);
      if (repositories.length) {
        displayRepos(repositories);
      } else {
        repo__links.innerHTML = `<p class="text-white">No repo to display</p>`;
      }
    });
};

const displayInfo = (person) => {
  result.classList.replace("hidden", "flex");
  loading.classList.replace("block", "hidden");

  user.textContent = person.name ? person.name : "No name to display";
  username.textContent = "@" + person.login;
  bio.textContent = person.bio ? person.bio : "No bio to display";
  repos.textContent = person.public_repos;
  followers.textContent = person.followers;
  followings.textContent = person.following;
  img.src = person.avatar_url;
  joined.textContent = person.created_at.slice(0, 10);
};

const displayRepos = (repos) => {
  repos.forEach((r) => {
    let a = document.createElement("a");
    a.href = r.clone_url;
    a.target = "_blank";
    a.className =
      "p-2 bg-blue-600 rounded-xl items-center  text-white text-base mr-2 cursor-pointer";
    a.textContent = r.name;
    repo__links.append(a);
  });
};

btn.addEventListener("click", () => {
  const givenValue = input.value.trim().toLowerCase();

  if (!givenValue) {
    return;
  }

  loading.classList.replace("hidden", "block");
  result.classList.replace("flex", "hidden");

  getUser(givenValue);
  getRepos(givenValue);

  input.value = "";
  repo__links.innerHTML = "";
});
