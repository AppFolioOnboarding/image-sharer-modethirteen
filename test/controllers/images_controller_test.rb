require 'test_helper'

class ImagesControllerTest < ActionDispatch::IntegrationTest
  test 'images index redirects home' do
    get images_url
    assert_redirected_to root_url
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
end
