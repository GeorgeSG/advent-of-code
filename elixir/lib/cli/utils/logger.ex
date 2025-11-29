defmodule AdventOfCode.Cli.Utils do
  def log(message) do
    IO.puts("[#{DateTime.utc_now()}] #{message}")
  end

  # TODO: just use Logger?
  def green(message) do
    "#{IO.ANSI.green()}#{IO.ANSI.bright()}#{message}#{IO.ANSI.reset()}"
  end

  def red(message) do
    "#{IO.ANSI.red()}#{IO.ANSI.bright()}#{message}#{IO.ANSI.reset()}"
  end
end
