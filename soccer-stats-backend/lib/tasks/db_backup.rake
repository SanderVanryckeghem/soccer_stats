namespace :db do
  desc "Backup the database"
  task backup: :environment do
    config = ActiveRecord::Base.connection_config
    filename = "#{Rails.application.class.parent_name.underscore}_#{Rails.env}_#{Time.current.strftime('%Y%m%d_%H%M%S')}.sql"
    
    system("mysqldump -u #{config[:username]} -p#{config[:password]} #{config[:database]} > db/backups/#{filename}")
    puts "Database backed up to db/backups/#{filename}"
  end
end