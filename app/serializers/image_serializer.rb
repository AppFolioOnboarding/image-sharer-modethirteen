class ImageSerializer
  include JSONAPI::Serializer

  attributes :url, :hostname
  attribute :created, &:created_at

  link :self do |object, params|
    html = "#{params[:href]}/#{object.id}"
    { html: html, json: "#{html}.json" }
  end

  link :next do |object, params|
    resource = object.next
    if resource.is_a?(Image)
      html = "#{params[:href]}/#{resource.id}"
      { html: html, json: "#{html}.json" }
    end
  end

  link :previous do |object, params|
    resource = object.previous
    if resource.is_a?(Image)
      html = "#{params[:href]}/#{resource.id}"
      { html: html, json: "#{html}.json" }
    end
  end
end
