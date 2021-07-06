import { login, getUserInfo, logout } from "@/api/user";

const state = {
  hasLogin: false,
  nickname: "",
  avatar: "",
  balance: 0,
  memberId: "",
};

const mutations = {
  SET_HAS_LOGIN: (state, hasLogin) => {
    state.hasLogin = hasLogin;
  },
  SET_NICKNAME: (state, nickname) => {
    state.nickname = nickname;
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar;
  },
  SET_BALANCE: (state, balance) => {
    state.balance = balance;
  },
  SET_MEMBERID: (state, memberId) => {
    state.memberId = memberId;
  },
};

const actions = {
  // login
  login({ commit }, data) {
    const { code, rawData } = data;
    return new Promise((resolve, reject) => {
      login(code, rawData)
        .then((response) => {
          const { access_token, token_type } = response.data;
          const token = token_type + " " + access_token;
          uni.setStorageSync("token", token);
          commit("SET_HAS_LOGIN", true);
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // get user info
  getUserInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getUserInfo()
        .then((response) => {
          const { data } = response;
          if (!data) {
            reject("Verification failed, please Login again.");
          }
          const { id, nickName, avatarUrl, balance } = data;
          uni.setStorageSync("nickName", nickName);
          uni.setStorageSync("avatar", avatarUrl);
          uni.setStorageSync("balance", balance);
          uni.setStorageSync("memberId", id);
          commit("SET_NICKNAME", nickName);
          commit("SET_AVATAR", avatarUrl);
          commit("SET_BALANCE", balance);
          commit("SET_MEMBERID", id);
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // user logout
  logout({ commit, state }) {
    console.log("logout");
    return new Promise((resolve, reject) => {
      logout()
        .then(() => {
          uni.clearStorageSync();
          commit("SET_HAS_LOGIN", false);
          commit("SET_NICKNAME", "");
          commit("SET_AVATAR", "");
          commit("SET_BALANCE", "");
          commit("SET_MEMBERID", "");
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // get storage data
  getStorage({ commit }) {
    const memberId = uni.getStorageSync("memberId");
    const nickname = uni.getStorageSync("nickName");
    const avatar = uni.getStorageSync("avatar");
    const balance = uni.getStorageSync("balance");
    commit("SET_HAS_LOGIN", true);
    commit("SET_NICKNAME", nickname);
    commit("SET_AVATAR", avatar);
    commit("SET_BALANCE", balance);
    commit("SET_MEMBERID", memberId);
    
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
