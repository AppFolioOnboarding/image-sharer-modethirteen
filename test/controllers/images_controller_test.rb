require 'test_helper'

class ImagesControllerTest < ActionDispatch::IntegrationTest

  test 'can get image container for image react component' do
    image = Image.create(url: 'https://example.com/xyzzy.png')
    get image_url(image.id)
    assert_response :success
    assert_select 'div/@id', 'image-container'
    assert_select 'div/@data-image-id', image.id
  end

  test 'can get image data' do
    foo = Image.create(url: 'https://images.io/xyzzy.png')
    bar = Image.create(url: 'https://images.com/plugh.png')
    baz = Image.create(url: 'https://images.org/fred.png')
    get image_url(bar.id), params: { format: :json }
    assert_response :success
    assert_equal 'application/json', response.content_type
    assert_equal response.body, JSON[{
      data: {
        id: "#{bar.id}",
        type: 'image',
        attributes: {
          url: bar.url,
          hostname: bar.hostname,
          created: bar.created_at.iso8601(3)
        },
        links: {
          self: {
            html: image_url(bar.id),
            json: "#{image_url(bar.id)}.json"
          },
          next: {
            html: image_url(foo.id),
            json: "#{image_url(foo.id)}.json"
          },
          previous: {
            html: image_url(baz.id),
            json: "#{image_url(baz.id)}.json"
          }
        }
      }
    }]
  end
end
