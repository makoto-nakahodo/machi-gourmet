class UsersController < ApplicationController
  before_action :require_user_logged_in, only: [:destroy]
  
  def new
    @user = User.new
  end

  def create
    @user = User.new(user_params)
    if @user.save
      flash[:success] = '会員登録しました。'
      redirect_to root_url
    else
      flash.now[:danger] = '会員登録に失敗しました。'
      render :new
    end 
  end

  def destroy
    @user = User.find(params[:id])
    @user.destroy
    flash[:success] = 'サービスをご利用いただきまことにありがとうございます。またのご利用をお待ちしております。'
    redirect_to root_url
  end
  
  private 
  def user_params
    params.require(:user).permit(:name, :email, :password, :password_confirmation)
  end
end
