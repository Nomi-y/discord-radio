

settings.log.level := 3

settings.server.telnet := true
settings.server.telnet.bind_addr := "127.0.0.1"
settings.server.telnet.port := 1234
settings.server.timeout := -1

def source_tag(s, tag) =
  def f(_) =
    [("source_tag", (tag : string))]
  end
  metadata.map(id=tag, insert_missing=true, f, s)
end



set("frame.audio.samplerate", 48000)
set("frame.audio.channels", 2)

music =mksafe(playlist("/audio/music", mode="random", reload=60))
music = source_tag(music, "music")

intermission = mksafe(playlist("/audio/intermissions", mode="random", reload=60))
intermission = source_tag(intermission, "intermission")


def transition(a, b) =
  if
    a.metadata["source_tag"] != "music" or a.metadata["source_tag"] != "music"
  then
    sequence([a.source, b.source])
  else
    cross.simple(a.source, b.source)
  end
end

radio = rotate(weights=[6,1], [music, intermission])
radio = cross(duration=1., transition, radio)


output.icecast(
  %opus(
    vbr="unconstrained",
    bitrate=128,
    samplerate=48000,
    channels=2
  ),
host="icecast",
  port=8000,
  password="insftKNHq6R3uBTEycESwGgvXd7O3xmnc3KMTTYGWnPg8Sy1rkm1M8gte5MophSo",
  mount="/stream",
    mksafe(radio)
)

def skip_command(_) =
  source.skip(radio)
  "Skipped!"
end



server.register(
  namespace="api",
  usage="skip",
  description="Skip current track",
  "skip",
  skip_command
)
