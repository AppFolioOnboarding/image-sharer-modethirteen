class Image < ApplicationRecord
  acts_as_taggable_on :tags

  attribute :hostname, :string
  attribute :next
  attribute :previous

  def hostname
    @hostname = URI.parse(self[:url]).host
  rescue URI::InvalidURIError
    'the interwebs'
  end

  # NOTE (andy.vaughn@appfolio.com, 20210303): pagination is descending, from most recent id to earliest
  def next
    Image.where('id < ?', id).order('id DESC').first || Image.last
  end

  def previous
    Image.where('id > ?', id).order('id ASC').first || Image.first
  end

  validates :url,
            format: {
              with: URI::DEFAULT_PARSER.make_regexp(%w[https]),
              message: 'must be a valid URL beginning with "https"'
            }

  validate :assert_valid_url

  # TODO: (andy.vaughn@appfolio.com): stop hijacking URI::InvalidURIError for exceptional validation behavior
  def assert_valid_url
    raise URI::InvalidURIError unless URI.parse(url).path.end_with?('.png', '.jpg', '.jpeg', 'gif')
  rescue URI::InvalidURIError
    errors.add(:url, 'must be an allowed file extension (allowed: .png, .jpg, .jpeg, .gif)')
  end
end
