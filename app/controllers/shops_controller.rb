class ShopsController < ApplicationController
  before_action :require_user_logged_in
  before_action :correct_user, only: [:destroy]
  
  def index
    @shops = current_user.shops.order(id: :desc).page(params[:page]).per(10)
  end

  def create
    @shop = current_user.shops.build(shop_params)
    @shop.save
  end

  def destroy
    @shop.destroy
    redirect_back(fallback_location: searches_path)
  end
  
  private
  
  def shop_params
    params.permit(:name, :url, :image_url, :opentime)
  end
  
  def correct_user
    @shop = current_user.shops.find_by(id: params[:id])
    unless @shop
      redirect_to root_url
    end
  end
end
