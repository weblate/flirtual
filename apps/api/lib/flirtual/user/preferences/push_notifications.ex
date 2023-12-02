defmodule Flirtual.User.Preferences.PushNotifications do
  use Flirtual.Schema, primary_key: false

  import Ecto.Changeset

  alias Flirtual.User.Preferences

  @derive {Jason.Encoder, only: [:matches, :messages, :likes, :reminders, :newsletter]}

  schema "preferences_push_notifications" do
    belongs_to(:preferences, Preferences,
      primary_key: true,
      references: :user_id
    )

    field(:matches, :boolean, default: true)
    field(:messages, :boolean, default: true)
    field(:likes, :boolean, default: true)
    field(:reminders, :boolean, default: true)
    field(:newsletter, :boolean, default: true)
  end

  def update_changeset(%Preferences.PushNotifications{} = push_notifications, attrs) do
    push_notifications
    |> cast(attrs, [
      :matches,
      :messages,
      :likes,
      :reminders,
      :newsletter
    ])
  end
end
