<template>
	<view class="container">
		<!-- 空白页 -->
		<view v-if="!hasLogin || empty === true" class="empty">
			<image src="/static/emptyCart.jpg" mode="aspectFit"></image>
			<view v-if="hasLogin" class="empty-tips">
				空空如也
				<navigator class="navigator" v-if="hasLogin" url="../index/index" open-type="switchTab">随便逛逛>
				</navigator>
			</view>
			<view v-else class="empty-tips">
				空空如也
				<view class="navigator" @click="navToLogin">去登陆></view>
			</view>
		</view>
		<view v-else>
			<!-- 列表 -->
			<view class="cart-list">
				<block v-for="(item, index) in cartItems" :key="item.skuId">
					<view class="cart-item" :class="{ 'b-b': index !== cartList.length - 1 }">
						<view class="image-wrapper">
							<image @click="navTo(item.spuId)" :src="item.pic" class="loaded" mode="aspectFill" lazy-load
								@load="onImageLoad('cartItems', index)" @error="onImageError('cartItems', index)">
							</image>
							<view class="yticon icon-xuanzhong2 checkbox" :class="{ checked: item.checked }"
								@click="handleCheckItem(index, item.skuId)"></view>
						</view>
						<view class="item-right">
							<text @click="navTo(item.spuId)" class="clamp title">{{ item.skuName }}</text>
							<text @click="navTo(item.spuId)" class="price">¥{{ item.price | moneyFormatter }}</text>
							<uni-number-box class="step" :min="1" :max="item.stock"
								:value="item.count > item.stock ? item.stock : item.count"
								:isMax="item.count >= item.stock ? true : false" :isMin="item.count === 1"
								:index="index" @eventChange="handleChangeCount($event, item.skuId)" 
								/>
						</view>
						<text class="del-btn yticon icon-fork" @click="removeCartItem(item.skuId)"></text>
					</view>
				</block>
			</view>
			<!-- 底部菜单栏 -->
			<view class="action-section">
				<view class="checkbox">
					<image :src="allChecked ? '/static/selected.png' : '/static/select.png'" mode="aspectFit"
						@click="handleCheckAll()"></image>
					<view class="clear-btn" :class="{ show: allChecked }" @click="clearCart">清空</view>
				</view>
				<view class="total-box">
					<text class="price">¥{{ totalPrice | moneyFormatter }}</text>
					<text class="coupon">
						已优惠
						<text>{{ coupon | moneyFormatter }}</text>
						元
					</text>
				</view>
				<button type="primary" class="no-border confirm-btn" @click="handleCreateOrder"
					:disabled="!isSubmit">去结算</button>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapGetters
	} from 'vuex';
	import {
		getCart,
		checkAll,
		deleteCart,
		addCartItem,
		updateCartItem,
		removeCartItem
	} from '@/api/oms/cart.js';
	import uniNumberBox from '@/components/uni-number-box.vue';
	import {setCartTabBadge,setCartTotalNum} from '@/utils/app.js';
	export default {
		components: {
			uniNumberBox
		},
		data() {
			return {
				totalPrice: 0, //总价格
				allChecked: false, //全选状态  true|false
				empty: false, //空白页现实  true|false
				cartItems: [],
				coupon: 0,
				isSubmit: false,
				key:0
			};
		},
		onShow: function() {
			//加载页面时，查询购物车详情
			console.log('========>> 进入商品详情页面, 路径:', this.$mp.page.route);
			if(this.hasLogin){
				this.loadData();
			}
		},
		
		watch: {
			//显示空白页
			cartItems(e) {
				let empty = e.length === 0 ? true : false;
				if (this.empty !== empty) {
					this.empty = empty;
				}
			},
		},
		computed: {
			...mapGetters(['hasLogin'])
		},
		methods: {
			//请求数据
			loadData() {
				getCart().then(response => {
					this.cartItems = [];
					this.totalPrice = 0;
					console.log('获取购物车数据', response);
					const {
						items
					} = response.data;
					if (items.length > 0) {
						setCartTotalNum(items.length)
						this.$store.dispatch('user/getCartCount')
						items.forEach((item, index) => {
							this.$set(this.cartItems, index, item)
						})
						setCartTabBadge()
						this.changeCart(); //计算总价
					}
				});
			},

			//监听image加载完成
			onImageLoad(key, index) {
				this.$set(this[key][index], 'loaded', 'loaded');
			},

			//监听image加载失败
			onImageError(key, index) {
				this[key][index].image = '/static/errorImage.jpg';
			},

			// 购物车商品数量change事件
			handleChangeCount(data, skuId) {
				const cartItem = {
					skuId: skuId,
					count: data.number
				};
				console.log('商品数量change事件', cartItem);
				updateCartItem(skuId, cartItem).then(response => {
					this.loadData();
				});
			},

			// 购物车(单个)商品选中/取消选中事件
			handleCheckItem(index, skuId) {
				const params = {
					checked: !this.cartItems[index].checked
				};
				updateCartItem(skuId, params).then(() => {
					this.loadData();
				});
			},

			// 购物车全选/全部取消事件
			handleCheckAll() {
				console.log('点击了全选');
				const params = {
					checked: !this.allChecked
				};
				checkAll(params).then((response) => {
						this.loadData();
					})
					.catch((err) => {
						console.log('发送失败', err);
					});
			},

			// 删除购物车商品
			removeCartItem(skuId) {
				uni.showModal({
					content: '删除该商品？',
					success: (e) => {
						if (e.confirm) {
							removeCartItem(skuId).then(response => {
								this.loadData();
							})
						} else {
							console.log('取消删除操作')
						}
					}
				});
				uni.hideLoading();
			},
			// 清空购物车
			clearCart() {
				uni.showModal({
					content: '清空购物车？',
					success: e => {
						if (e.confirm) {
							deleteCart().then(response => {
								this.loadData();
							});
						}
					}
				});
			},
			// 更新购物车角标
			updateCartTabBadge(cartTotalNum){
				this.$store.dispatch('updateBadge',cartTotalNum)
			},
			//计算总价
			changeCart() {
				if (this.cartItems.length == 0) {
					this.empty = true;
					return;
				}

				let checked = true;
				for (let i = 0; i < this.cartItems.length; i++) {
					if (this.cartItems[i].checked == false) {
						checked = false;
						break;
					}
				}
				this.allChecked = checked;
				this.isSubmit = false
				const checkedList = this.cartItems.filter(item => item.checked)
				// console.log(checkedList);
				if (checkedList.length) {
					this.isSubmit = true
				}
				let temPrice = 0
				checkedList.forEach(item => {
					temPrice += item.price * item.count
				})
				this.totalPrice = temPrice

			},

			// 结算页面
			handleCreateOrder() {
				uni.navigateTo({
					url: `/pages/order/createOrder`
				});
			},

			// 跳转到登录页
			navToLogin() {
				uni.navigateTo({
					url: '/pages/public/login'
				});
			},
			// 跳转到商品详情页
			navTo(id) {
				uni.navigateTo({
					url: `/pages/product/product?id=${id}`
				})
			}
		}
	};
</script>

<style lang="scss">
	.container {
		padding-bottom: 134upx;

		/* 空白页 */
		.empty {
			position: fixed;
			left: 0;
			top: 0;
			width: 100%;
			height: 100vh;
			padding-bottom: 100upx;
			display: flex;
			justify-content: center;
			flex-direction: column;
			align-items: center;
			background: #fff;

			image {
				width: 240upx;
				height: 160upx;
				margin-bottom: 30upx;
			}

			.empty-tips {
				display: flex;
				font-size: $font-sm + 2upx;
				color: $font-color-disabled;

				.navigator {
					color: $uni-color-primary;
					margin-left: 16upx;
				}
			}
		}
	}

	/* 购物车列表项 */
	.cart-item {
		display: flex;
		position: relative;
		padding: 30upx 40upx;

		.image-wrapper {
			width: 230upx;
			height: 230upx;
			flex-shrink: 0;
			position: relative;

			image {
				border-radius: 8upx;
			}
		}

		.checkbox {
			position: absolute;
			left: -16upx;
			top: -16upx;
			z-index: 8;
			font-size: 44upx;
			line-height: 1;
			padding: 4upx;
			color: $font-color-disabled;
			background: #fff;
			border-radius: 50px;
		}

		.item-right {
			display: flex;
			flex-direction: column;
			flex: 1;
			overflow: hidden;
			position: relative;
			padding-left: 30upx;

			.title,
			.price {
				font-size: $font-base + 2upx;
				color: $font-color-dark;
				height: 40upx;
				line-height: 40upx;
			}

			.attr {
				font-size: $font-sm + 2upx;
				color: $font-color-light;
				height: 50upx;
				line-height: 50upx;
			}

			.price {
				height: 50upx;
				line-height: 50upx;
			}
		}

		.del-btn {
			padding: 4upx 10upx;
			font-size: 34upx;
			height: 50upx;
			color: $font-color-light;
		}
	}

	/* 底部栏 */
	.action-section {
		/* #ifdef H5 */
		margin-bottom: 100upx;
		/* #endif */
		position: fixed;
		left: 30upx;
		bottom: 30upx;
		z-index: 95;
		display: flex;
		align-items: center;
		width: 690upx;
		height: 100upx;
		padding: 0 30upx;
		background: rgba(255, 255, 255, 0.9);
		box-shadow: 0 0 20upx 0 rgba(0, 0, 0, 0.5);
		border-radius: 16upx;

		.checkbox {
			height: 52upx;
			position: relative;

			image {
				width: 52upx;
				height: 100%;
				position: relative;
				z-index: 5;
			}
		}

		.clear-btn {
			position: absolute;
			left: 26upx;
			top: 0;
			z-index: 4;
			width: 0;
			height: 52upx;
			line-height: 52upx;
			padding-left: 38upx;
			font-size: $font-base;
			color: #fff;
			background: $font-color-disabled;
			border-radius: 0 50px 50px 0;
			opacity: 0;
			transition: 0.2s;

			&.show {
				opacity: 1;
				width: 120upx;
			}
		}

		.total-box {
			flex: 1;
			display: flex;
			flex-direction: column;
			text-align: right;
			padding-right: 40upx;

			.price {
				font-size: $font-lg;
				color: $font-color-dark;
			}

			.coupon {
				font-size: $font-sm;
				color: $font-color-light;

				text {
					color: $font-color-dark;
				}
			}
		}

		.confirm-btn {
			padding: 0 38upx;
			margin: 0;
			border-radius: 100px;
			height: 76upx;
			line-height: 76upx;
			font-size: $font-base + 2upx;
			background: $uni-color-primary;
			// box-shadow: 1px 2px 5px rgba(217, 60, 93, 0.72);
		}
	}

	/* 复选框选中状态 */
	.action-section .checkbox.checked,
	.cart-item .checkbox.checked {
		color: $uni-color-primary;
	}
</style>
