class ImagesController < ApplicationController
  protect_from_forgery with: :exception

  def index
    respond_to do |format|
      # TODO: (andyv.vaughn@appfolio.con, 20210303): grab tags from request and include in redirect
      format.html { redirect_to controller: 'application', action: 'home', status: :found }
      format.json do
        # TODO: (andy.vaughn@appfolio.com, 20210301): filter API results by incoming tag(s)
        @images = Image.all.order('id DESC')
        render json: ImageSerializer.new(@images,
                                         is_collection: true,
                                         params: {
                                           href: images_url
                                         },
                                         meta: {
                                           count: @images.count
                                         },
                                         links: {
                                           self: {
                                             html: images_url,
                                             json: images_url(format: :json)
                                           }
                                         }).serializable_hash.to_json
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
        render json: ImageSerializer.new(@image,
                                         params: {
                                           href: images_url
                                         }).serializable_hash.to_json
      end
    end
  end
end
