require 'test_helper'

class ImagesControllerTest < ActionDispatch::IntegrationTest
  test 'can get thumbnails container for thumbnails react component' do
    get root_url
    assert_response :success
    assert_select 'div/@id', 'thumbnails-container'
  end

  test 'can navigate to submit image form from homepage' do
    get root_url
    assert_response :success
    assert_select '.navbar .btn', 'Submit an Image'
    assert_select '.navbar a[href=?]', '/images/new'
  end

  test 'can get image container for image react component' do
    image = Image.create(url: 'https://example.com/xyzzy.png')
    get image_url(image.id)
    assert_response :success
    assert_select 'div/@id', 'image-container'
    assert_select 'div/@data-image-id', image.id
  end

  test 'can get thumbnails data' do
    foo = Image.create(url: 'https://images.io/xyzzy.png')
    bar = Image.create(url: 'https://images.com/plugh.png')
    bar.tag_list.add('corge')
    bar.save
    baz = Image.create(url: 'https://images.org/fred.png')
    baz.tag_list.add('waldo', 'grault')
    baz.save
    get images_url, params: { format: :json }
    assert_response :success
    assert_equal 'application/json', response.content_type
    assert_equal response.body, JSON[{
      data: [
        {
          id: baz.id.to_s,
          type: 'image',
          attributes: {
            url: baz.url,
            hostname: baz.hostname,
            created: baz.created_at.iso8601(3),
            tags: %w[waldo grault]
          },
          links: {
            self: {
              html: image_url(baz.id),
              json: "#{image_url(baz.id)}.json"
            },
            next: {
              html: image_url(bar.id),
              json: "#{image_url(bar.id)}.json"
            },
            previous: {
              html: image_url(foo.id),
              json: "#{image_url(foo.id)}.json"
            }
          }
        },
        {
          id: bar.id.to_s,
          type: 'image',
          attributes: {
            url: bar.url,
            hostname: bar.hostname,
            created: bar.created_at.iso8601(3),
            tags: %w[corge]
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
        },
        {
          id: foo.id.to_s,
          type: 'image',
          attributes: {
            url: foo.url,
            hostname: foo.hostname,
            created: foo.created_at.iso8601(3),
            tags: []
          },
          links: {
            self: {
              html: image_url(foo.id),
              json: "#{image_url(foo.id)}.json"
            },
            next: {
              html: image_url(baz.id),
              json: "#{image_url(baz.id)}.json"
            },
            previous: {
              html: image_url(bar.id),
              json: "#{image_url(bar.id)}.json"
            }
          }
        }
      ],
      meta: {
        count: 3
      },
      links: {
        self: {
          html: images_url,
          json: "#{images_url}.json"
        }
      }
    }]
  end

  test 'can get image data' do
    foo = Image.create(url: 'https://images.io/xyzzy.png')
    bar = Image.create(url: 'https://images.com/plugh.png')
    bar.tag_list.add('thud', 'quux')
    bar.save
    baz = Image.create(url: 'https://images.org/fred.png')
    get image_url(bar.id), params: { format: :json }
    assert_response :success
    assert_equal 'application/json', response.content_type
    assert_equal response.body, JSON[{
      data: {
        id: bar.id.to_s,
        type: 'image',
        attributes: {
          url: bar.url,
          hostname: bar.hostname,
          created: bar.created_at.iso8601(3),
          tags: %w[thud quux]
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

  test 'can get image submission form' do
    get '/images/new'
    assert_response :success
    assert_select 'form/@action', images_path
    assert_select 'form//input[@id="image_url"]', true
    assert_select 'form//input[@id="image_tag_list"]', true
  end

  test 'can save valid image data' do
    assert_difference -> { Image.count }, 1 do
      post images_url, params: { image: { url: 'https://example.com/foo.png', tag_list: 'baz, qux' } }
    end
    assert_redirected_to image_url(Image.last)
    follow_redirect!
    assert_select 'div[@id="flash-container"]/@data-messages' do |attribute|
      messages = JSON.parse attribute.text
      assert_equal 1, messages.count
      assert_equal 'success', messages[0]['type']
    end
  end

  test 'cannnot save invalid image data' do
    post images_url, params: { image: { url: 'http://example.com/foo.txt', tag_list: 'baz, qux' } }
    assert_response :unprocessable_entity
  end

  test 'cannnot save empty image data' do
    post images_url
    assert_response :unprocessable_entity
    assert_select 'div[@id="flash-container"]/@data-messages' do |attribute|
      messages = JSON.parse attribute.text
      assert_equal 1, messages.count
      assert_equal 'error', messages[0]['type']
    end
  end

  test 'can destroy image' do
    image = Image.create!(url: 'https://images.io/xyzzy.png')
    delete image_url image, format: :json
    assert_response :no_content
  end

  test 'cannot destroy not found image' do
    delete image_url 123, format: :json
    assert_response :not_found
  end

  test 'cannot render image submission button on image submission form' do
    get '/images/new'
    assert_response :success
    assert_select 'a[@id="image-submission"]', false
  end

  test 'can render image submission button on image view page' do
    foo = Image.create!(url: 'https://images.com/plugh.png')
    get image_url(foo.id)
    assert_response :success
    assert_select 'a[@id="image-submission"]', true
  end

  test 'can render image submission button on thumbnails page' do
    get images_url
    assert_response :success
    assert_select 'a[@id="image-submission"]', true
  end
end
