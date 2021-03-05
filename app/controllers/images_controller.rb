class ImagesController < ApplicationController
  protect_from_forgery with: :exception

  def index; end

  def new
    @image = Image.new
  end

  def create
    @image = Image.new(params[:image].permit(:url))
    if @image.save
      # TODO (andy.vaughn@appfolio.com, 20210302): localize flash message
      flash[:success] = 'Image successfully submitted.'
      redirect_to @image
    else
      render 'new', status: :unprocessable_entity
    end
  end

  def show
    @image = Image.find(params[:id])
    respond_to do |format|
      format.html
      format.json {
        render json: ImageSerializer.new(@image, {
          params: {
            href: images_url
          }
        }).serializable_hash.to_json
      }
    end
  end
end
