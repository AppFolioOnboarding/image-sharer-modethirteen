class ImagesController < ApplicationController
  protect_from_forgery with: :exception

  def index
    respond_to do |format|
      format.html { redirect_to controller: 'application', action: 'home', tag: params[:tag], status: :found }
      format.json do
        render json: serialize_images((if params[:tag]
                                         Image.tagged_with(params[:tag])
                                       else
                                         Image.all
                                       end).order('id DESC'))
      end
    end
  end

  def new
    @image = Image.new
  end

  def create
    @image = Image.new(params[:image].permit(:url, :tag_list))
    if @image.save
      # TODO: (andy.vaughn@appfolio.com, 20210302): localize flash message
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
      format.json do
        render json: serialize_image(@image)
      end
    end
  end

  private

  def serialize_image(image)
    ImageSerializer.new(image,
                        params: {
                          href: images_url
                        }).serializable_hash.to_json
  end

  def serialize_images(images)
    ImageSerializer.new(images,
                        is_collection: true,
                        params: {
                          href: images_url
                        },
                        meta: {
                          count: images.count
                        },
                        links: {
                          self: {
                            html: images_url,
                            json: images_url(format: :json)
                          }
                        }).serializable_hash.to_json
  end
end
