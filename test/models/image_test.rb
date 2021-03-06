require 'test_helper'

class ImageTest < ActiveSupport::TestCase
  test 'can save image if url starts with https' do
    url = 'https://example.com/foo.png'
    image = Image.new(url: url)
    assert(image.valid?)
  end

  test 'cannot save image if url does not start with https' do
    url = 'http://example.com/foo.png'
    image = Image.new(url: url)
    refute(image.valid?)
  end

  test 'cannot save image if url is invalid' do
    %w[
      foo
      foo bar
      https//example.com/foo
      https://foo.jpg
    ].each do |url|
      image = Image.new(url: url)
      refute(image.valid?)
    end
  end

  test 'can save image if url path ends with image file extension' do
    %w[
      https://example.com/foo.jpg
      https://example.com/foo.jpeg
      https://example.com/foo.png
      https://example.com/foo.gif
      https://example.com/foo.jpg?a=b#fred
      https://example.com/foo.jpeg?b=c#qux
      https://example.com/foo.png?c=d#baz
      https://example.com/foo.gif?d=f#bar
      https://example.com/a/foo.jpg?a=b#fred
      https://example.com/b/foo.jpeg?b=c#qux
      https://example.com/c/foo.png?c=d#baz
      https://example.com/d/foo.gif?d=f#bar
    ].each do |url|
      image = Image.new(url: url)
      assert(image.valid?)
    end
  end

  test 'cannot save image if url does not end with image file extension' do
    %w[
      https://example.com/foo
      https://example.com/foo.doc
      https://example.com/foo.txt
      https://example.com/foo.pdf
      https://example.com/foo?a=b#fred
      https://example.com/foo.doc?b=c#qux
      https://example.com/foo.txt?c=d#baz
      https://example.com/foo.pdf?d=f#bar
      https://example.com/a/foo?a=b#fred
      https://example.com/b/foo.doc?b=c#qux
      https://example.com/c/foo.txt?c=d#baz
      https://example.com/d/foo.pdf?d=f#bar
    ].each do |url|
      image = Image.new(url: url)
      refute(image.valid?)
    end
  end

  test 'can get url' do
    image = Image.new(url: 'https://example.com/xyzzy.png')
    url = image.url
    assert_equal url, 'https://example.com/xyzzy.png'
  end

  test 'can get hostname' do
    image = Image.new(url: 'https://example.com/xyzzy.png')
    hostname = image.hostname
    assert_equal hostname, 'example.com'
  end

  test 'can get next descending record' do
    foo = Image.create(url: 'https://example.com/xyzzy.png')
    bar = Image.create(url: 'https://example.com/xyzzy.png')
    baz = Image.create(url: 'https://example.com/xyzzy.png')
    assert_same baz.next.id, bar.id
    assert_same bar.next.id, foo.id
    assert_same foo.next.id, baz.id
  end

  test 'can get previous ascending record' do
    foo = Image.create(url: 'https://example.com/xyzzy.png')
    bar = Image.create(url: 'https://example.com/xyzzy.png')
    baz = Image.create(url: 'https://example.com/xyzzy.png')
    assert_same foo.previous.id, bar.id
    assert_same bar.previous.id, baz.id
    assert_same baz.previous.id, foo.id
  end

  test 'can add tags' do
    foo = Image.create(url: 'https://example.com/xyzzy.png')
    foo.tag_list.add('bar', 'baz')
    foo.save
    assert_equal foo.tags.map(&:name), %w[bar baz]
  end
end
