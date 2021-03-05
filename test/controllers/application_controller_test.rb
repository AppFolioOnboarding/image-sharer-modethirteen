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
end
