class ToppagesController < ApplicationController
  def index
    if logged_in?
     redirect_to searches_url
    end 
  end
end
