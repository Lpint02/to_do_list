name = input("What is your name? ")
print(f"Hello {name} how are you?")
mood = input("Come stai? (bene/male) ")
if mood.lower() == "bene":
    print(f"Mi fa piacere {name}!")
else:
    print(f"Mi dispiace {name}.")
